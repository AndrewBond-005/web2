package servlets;

import bean.Result;
import bean.ResultBean;
import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import utils.Checker;
import utils.Validator;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/check")
public class AreaCheckServlet extends HttpServlet {
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)throws ServletException, IOException {
        PrintWriter out = response.getWriter();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        long startTime = System.nanoTime();
        String xstr = request.getParameter("x");
        String ystr = request.getParameter("y");
        String rstr = request.getParameter("r");
        ResultBean bean = (ResultBean) request.getSession().getAttribute("results");
        if (bean == null) {
            bean = new ResultBean();
            request.getSession().setAttribute("results", bean);
        }
        if(request.getParameter("clear")!=null && request.getParameter("clear").equals("true")){
            bean.getResults().clear();
            Map<String, Object> mess = new HashMap<>();
            mess.put("clear", "ok");
            out.write(new Gson().toJson(mess));
            return;
        }
        if (xstr == null || ystr == null || rstr == null) {
            request.getRequestDispatcher("/index.jsp").forward(request, response);
        }
        if (Validator.validate(xstr, ystr, rstr)) {
            var x = Double.parseDouble(xstr);
            var y = Double.parseDouble(ystr);
            var r = Integer.parseInt(rstr);
            var time = LocalDateTime.now().format(TIME_FORMATTER);
            Result result = new Result(x, y, r, Checker.check(x, y, r),time,0);
            result.setExecutionTime((System.nanoTime() - startTime) / 1000);
            bean.addResult(result);
            out.write(new Gson().toJson(result));
        } else {
            Map<String, Object> error = new HashMap<>();
            error.put("error", 400);
            error.put("message", "Invalid parameters");
            out.write(new Gson().toJson(error));
        }
    }
}

