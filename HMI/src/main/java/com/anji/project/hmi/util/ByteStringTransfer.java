package com.anji.project.hmi.util;

/**
 * created by chenpeng at 2018/8/3-0:00
 */
public class ByteStringTransfer {

    public static String bytes2ToHexString(byte[]bytes){
        StringBuilder result=new StringBuilder();
        for (byte b:bytes){
            String hex=Integer.toHexString(b&0xFF);
            if (hex.length()==1){
                hex='0'+hex;
            }
            result.append(hex.toUpperCase());
        }
        return result.toString();
    }
}
