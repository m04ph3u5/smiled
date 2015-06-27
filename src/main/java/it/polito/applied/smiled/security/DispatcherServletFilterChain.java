package it.polito.applied.smiled.security;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

public class DispatcherServletFilterChain implements Filter{

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		HttpServletRequest req = (HttpServletRequest) request;
		String path = req.getRequestURI().substring(req.getContextPath().length());

		System.out.println("FILTER");
		System.out.println(req.getRequestURI());
		System.out.println(path);
		if (path.startsWith("/assets") || path.startsWith("/api") || path.startsWith("/websocket")) {
		    chain.doFilter(request, response); // Goes to default servlet.
		} else{
		    request.getRequestDispatcher("/app" + path).forward(request, response);
		}
		
	}

	@Override
	public void destroy() {
		// TODO Auto-generated method stub
		
	}

}
