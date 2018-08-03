package com.anji.project.hmi.filter;

/**
 * created by chenpeng at 2018/8/2-22:53
 */

import com.alibaba.druid.support.http.WebStatFilter;

import javax.servlet.annotation.WebFilter;
import javax.servlet.annotation.WebInitParam;

@WebFilter(
        filterName="druidWebStatFilter",urlPatterns="/*",
        initParams={
                /** 忽略资源 */
                @WebInitParam(name="exclusions", value="*.js,*.gif,*.jpg,*.bmp,*.png,*.css,*.ico,/druid/*")
        })

public class DruidStatFilter extends WebStatFilter {
}
