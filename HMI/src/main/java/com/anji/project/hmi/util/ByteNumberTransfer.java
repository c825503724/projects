package com.anji.project.hmi.util;

/**
 * created by chenpeng at 2018/8/2-23:46
 */
public class ByteNumberTransfer {

    public static byte[] toByteArray(int i) {
        byte[] bytes = new byte[4];
        bytes[1] = (byte) ((i & 0x0000ff00) >> 8);
        bytes[0] = (byte) (i & 0x000000ff);
        return bytes;
    }

    // 从byte数组的index处的连续4个字节获得一个int(小端)
    public static int toInt4(byte[] arr, int index) {
        return (0xff000000 & (arr[index + 3] << 24)) |
                (0x00ff0000 & (arr[index + 2] << 16)) |
                (0x0000ff00 & (arr[index + 1] << 8)) |
                (0x000000ff & arr[index]);
    }

    public static int getInt2(byte[] arr, int index) {
        return
                (0x0000ff00 & (arr[index + 1] << 8)) |
                        (0x000000ff & arr[index + 0]);
    }

    public static int getInt1(byte[] arr, int index) {
        return
                (0x000000ff & arr[index + 0]);
    }

    // 从byte数组的index处的连续4个字节获得一个float
    public static float getFloat(byte[] arr, int index) {
        return Float.intBitsToFloat(toInt4(arr, index));
    }

    // long转换为byte[8]数组
    public static byte[] getByteArray(long l) {
        byte b[] = new byte[8];
        b[0] = (byte) (0xff & (l >> 56));
        b[1] = (byte) (0xff & (l >> 48));
        b[2] = (byte) (0xff & (l >> 40));
        b[3] = (byte) (0xff & (l >> 32));
        b[4] = (byte) (0xff & (l >> 24));
        b[5] = (byte) (0xff & (l >> 16));
        b[6] = (byte) (0xff & (l >> 8));
        b[7] = (byte) (0xff & l);
        return b;
    }

    // 从byte数组的index处的连续8个字节获得一个long
    public static long getLong(byte[] arr, int index) {
        return (0xff00000000000000L & ((long) arr[index + 0] << 56)) |
                (0x00ff000000000000L & ((long) arr[index + 1] << 48)) |
                (0x0000ff0000000000L & ((long) arr[index + 2] << 40)) |
                (0x000000ff00000000L & ((long) arr[index + 3] << 32)) |
                (0x00000000ff000000L & ((long) arr[index + 4] << 24)) |
                (0x0000000000ff0000L & ((long) arr[index + 5] << 16)) |
                (0x000000000000ff00L & ((long) arr[index + 6] << 8)) |
                (0x00000000000000ffL & (long) arr[index + 7]);
    }
}
