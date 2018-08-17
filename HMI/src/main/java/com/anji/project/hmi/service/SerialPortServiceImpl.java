package com.anji.project.hmi.service;

import com.anji.project.hmi.contoller.WebSocket;
import com.anji.project.hmi.entity.HMIRecord;
import com.anji.project.hmi.repository.HMIRecordRepository;
import com.anji.project.hmi.util.ByteNumberTransfer;
import gnu.io.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.context.event.ApplicationStartingEvent;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import javax.annotation.PreDestroy;
import java.io.IOException;
import java.io.InputStream;
import java.util.Random;
import java.util.Timer;
import java.util.TimerTask;
import java.util.TooManyListenersException;
import java.util.concurrent.BlockingDeque;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.TimeUnit;

/**
 * created by chenpeng at 2018/8/3-0:06
 */
@Service
public class SerialPortServiceImpl implements SerialPortService {

    private final static Logger logger = LoggerFactory.getLogger(SerialPortServiceImpl.class);
    private final BlockingDeque<byte[]> dataQueue = new LinkedBlockingDeque<>();
    private SerialPort serialPort;
    private final Consumer consumer = new Consumer();
    private volatile PortState serviceState = PortState.NOT_START;

    private final String execPath = "C:\\open_hmi.bat";

    @Autowired
    @Lazy
    private HMIRecordRepository hmiRecordRepository;


    @Value("${com.serialPortName}")
    private String serialPortName;

    @Value("${hmi.mock}")
    private Boolean mock;

    @Override
    public void onApplicationEvent(ApplicationEvent event) {
        if (event instanceof ApplicationReadyEvent) {
            start();
            if (mock) {
                Timer timer = new Timer();
                timer.scheduleAtFixedRate(new TimerTask() {
                    @Override
                    public void run() {
                        WebSocket.sendMessageToAll(getRandomRecord());
                    }
                }, 2L, 2000L);
             /*   try {
                    Runtime.getRuntime().exec(execPath);
                }catch (IOException e){
                    e.printStackTrace();
                }*/
            }

        }
    }

    private final float[] floats = {0.0F, 20.0F, 50.0F, 33.0F, 90.0F, 77.5f};
    private final int[] ints = {22, 44, 652, 10, 9, 88};

    private HMIRecord getRandomRecord() {
        HMIRecord record = new HMIRecord();
        Random random = new Random();
        record.setTheta(floats[random.nextInt(6)]);
        record.setLocation(ints[random.nextInt(6)]);
        record.setPower(floats[random.nextInt(6)]);
        record.setTargetLocation(ints[random.nextInt(6)]);
        record.setSpeed(floats[random.nextInt(6)]);
        record.setOperationStatus(ints[random.nextInt(6)]);
        record.setRoute(ints[random.nextInt(6)]);
        record.setNumber(ints[random.nextInt(6)]);
        record.setCommunicationStatus(ints[random.nextInt(6)]);
        record.setLocationY(floats[random.nextInt(6)]);
        record.setLocationX(floats[random.nextInt(6)]);
        return record;
    }

    @Override
    public void start() {
        if (serviceState == PortState.NOT_START || serviceState == PortState.FAIL) {
            if (init()) {
                serviceState = PortState.SUCCESS;
                Timer timer = new Timer();
                timer.schedule(consumer, 1000 * 2);
            } else {
                serviceState = PortState.FAIL;
            }
        }
    }

    @Override
    public Integer getMessageLengthNotConsumed() {
        return dataQueue.size();
    }

    @Override
    @PreDestroy
    public void stop() {
        serviceState = PortState.STOP;
        serialPort.close();
        consumer.stop();
    }


    private boolean init() {
        CommPortIdentifier port;
        try {
            port = CommPortIdentifier.getPortIdentifier(serialPortName);
        } catch (NoSuchPortException portException) {
            logger.error(String.format("获取不到串行端口%s", serialPortName), portException);
            return false;
        }
        COMListener comListener = new COMListener();
        // 判断端口类型是否为串口
        if (port.getPortType() == CommPortIdentifier.PORT_SERIAL) {
            try {
                // 打开串口名字为COM_1(名字任意),延迟为2毫秒
                serialPort = (SerialPort) port.open(serialPortName, 200);
            } catch (PortInUseException e) {
                logger.error(String.format("端口:%s被占用！", serialPortName), e);
                return false;
            }
            // 给当前串口添加一个监听器
            try {
                serialPort.addEventListener(comListener);
            } catch (TooManyListenersException e) {
                logger.error(String.format("端口：%s已经被监听！", serialPortName), e);
                return false;
            }
            // 设置监听器生效，即：当有数据时通知
            serialPort.notifyOnDataAvailable(true);
            // 设置串口的一些读写参数
            try {
                // 比特率、数据位、停止位、奇偶校验位
                serialPort.setSerialPortParams(57600,
                        SerialPort.DATABITS_8, SerialPort.STOPBITS_1,
                        SerialPort.PARITY_NONE);
            } catch (UnsupportedCommOperationException e) {
                logger.error("不支持端口操作！");
                return false;
            }
            return true;
        }
        logger.error(String.format("端口：%s,类型不是串口", serialPortName));
        return false;
    }


    @Override
    public PortState getServiceState() {
        return serviceState;
    }

    //生产者
    public class COMListener implements SerialPortEventListener {
        private final Integer PACKAGE_LENGTH = 1 + 12 + 4 + 4 + 1 + 2 + 2 + 2 + 1 + 1 + 1;
        private final Integer startMark = 0x55;
        private final Integer endMark = 0xAA;
        private final Long sleepTime = 100L;

        @Override
        public void serialEvent(SerialPortEvent serialPortEvent) {
            if (serialPortEvent.getEventType() == SerialPortEvent.DATA_AVAILABLE) {
//                byte[] data = null;
//                byte[] crc = null;
                try {
                    TimeUnit.MILLISECONDS.sleep(sleepTime);
                } catch (InterruptedException e) {

                }
                readAndSaveSerialData(serialPort);
//                data = readFromPort(serialPort);
//                String dataOriginal = ByteStringTransfer.bytes2ToHexString(data);
//                String dataValid = "";//合法数据流
//                crc = ByteNumberTransfer.getByteArray(getCrc(data));//CRC校验
//                if (data == null || data.length < 1) {    //检查数据是否读取正确
//                } else if (data[0] == 0x55 && data[31] == (byte) 0xAA /*&& data[29] == crc[0] && data[30] == crc[1]*/) {
//                    dataValid = dataOriginal.substring(2);
//                    if (dataValid == null || dataValid.length() < 1) {    //检查写入数据是否正确
//                        throw new RuntimeException("数据写入错误");
//                    } else {
//                        enqueue(data);
//                    }
//                }
            }
        }

        private void readAndSaveSerialData(SerialPort serialPort) {
            try {
                InputStream in = serialPort.getInputStream();
                byte[] r = new byte[PACKAGE_LENGTH];
                int data;
                int index = 0;
                while ((data = in.read()) != -1) {
                    if (data == startMark) {
                        if (r[0] == 0) {
                            r[0] = (byte) data;
                        } else {
                            r = new byte[PACKAGE_LENGTH];
                        }
                    } else if (data == endMark) {
                        r[index] = (byte) data;
                        if (index == PACKAGE_LENGTH - 1) {
                            enqueue(r);
                        }
                        r = new byte[PACKAGE_LENGTH];
                        index = 0;
                        continue;
                    } else {
                        r[index] = (byte) data;
                    }
                    ++index;
                }
            } catch (IOException ioe) {
                logger.error("串口读取错误", ioe);
            }
        }
    }

    //从串口读取数据
    public static byte[] readFromPort(SerialPort serialPort) {
        InputStream in = null;
        byte[] bytes = null;
        try {
            in = serialPort.getInputStream();
            int bufflenth = in.available();        //获取buffer里的数据长度
            while (bufflenth != 0) {
                bytes = new byte[bufflenth];//初始化byte数组为buffer中数据的长度
                in.read(bytes);
                bufflenth = in.available();
            }
        } catch (IOException e) {
            System.out.println("InputStream Read Error!");
            e.printStackTrace();
        } finally {
            try {
                if (in != null) {
                    in.close();
                }
            } catch (IOException e) {
                System.out.println("InputStream Close Error!");
                e.printStackTrace();
            }

        }
        return bytes;
    }


    //串口拿到的数据入队列
    private void enqueue(byte[] bytes) {
        dataQueue.push(bytes);
    }

    //CRC校验
    private static int getCrc(byte[] data) {
        int high;
        int flag;

        // 16位寄存器，所有数位均为1
        int wcrc = 0xFFFF;
        for (int i = 0; i < 29; i++) {
            // 16 位寄存器的高位字节
            high = wcrc >> 8;
            // 取被校验串的一个字节与 16 位寄存器的高位字节进行“异或”运算
            wcrc = high ^ data[i];

            for (int j = 0; j < 8; j++) {
                flag = wcrc & 0x0001;
                // 把这个 16 寄存器向右移一位
                wcrc = wcrc >> 1;
                // 若向右(标记位)移出的数位是 1,则生成多项式 1010 0000 0000 0001 和这个寄存器进行“异或”运算
                if (flag == 1)
                    wcrc ^= 0xA001;
            }
        }
        return wcrc;
    }

    //消费者
    public class Consumer extends TimerTask {

        private volatile boolean cancel = false;

        @Override
        public void run() {
            while (!cancel) {
                if (dataQueue.size() == 0) {
                    try {
                        TimeUnit.MILLISECONDS.sleep(200l);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                } else {
                    byte[] data = dataQueue.poll();
                    hmiRecordRepository.save(extractData(data));
                }
            }
        }

        public void stop() {
            cancel = true;
        }

        private HMIRecord extractData(byte[] data) {
            //分割数据
            float[] info = new float[12];
            info[0] = ByteNumberTransfer.getFloat(data, 1); //位置x
            info[1] = ByteNumberTransfer.getFloat(data, 5);//位置y
            info[2] = ByteNumberTransfer.getFloat(data, 9);//角度theta
            info[3] = ByteNumberTransfer.getFloat(data, 13);//速度
            info[4] = ByteNumberTransfer.getFloat(data, 17);//电量
            info[5] = ByteNumberTransfer.getInt1(data, 21);//车号
            info[6] = ByteNumberTransfer.getInt2(data, 22);/*当前点*/
            info[7] = ByteNumberTransfer.getInt2(data, 24);//目标点
            info[8] = ByteNumberTransfer.getInt2(data, 26);//当前段
            info[9] = ByteNumberTransfer.getInt1(data, 28);//操作状态
            info[10] = ByteNumberTransfer.getInt1(data, 29);//通信状态

            //写入结构
            HMIRecord hmi = new HMIRecord();
            hmi.setNumber((int) info[5]);
            hmi.setLocationX(info[0]);
            hmi.setLocationY(info[1]);
            hmi.setTheta(info[2]);
            hmi.setLocation((int) info[6]);
            hmi.setRoute((int) info[8]);
            hmi.setTargetLocation((int) info[7]);
            hmi.setOperationStatus((int) info[9]);
            hmi.setCommunicationStatus((int) info[10]);
            hmi.setSpeed(info[3]);
            hmi.setPower(info[4]);
            return hmi;
        }
    }
}

