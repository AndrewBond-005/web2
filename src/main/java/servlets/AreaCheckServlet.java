package servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import com.google.gson.Gson;
import jakarta.servlet.ServletException; // Changed
import jakarta.servlet.annotation.WebServlet; // Changed
import jakarta.servlet.http.HttpServlet; // Changed
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import bean.Result;
import bean.ResultBean;
import utils.Checker;
import utils.Validator;

@WebServlet("/check") // Added
public class AreaCheckServlet extends HttpServlet{
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        PrintWriter out=response.getWriter();
        long startTime = System.nanoTime();
        String xstr = request.getParameter("x");
        String ystr = request.getParameter("y");
        String rstr = request.getParameter("r");
        if (xstr == null || ystr == null || rstr == null) {
            request.getRequestDispatcher("/index.jsp").forward(request, response);
        }
        if(Validator.validate(xstr,ystr,rstr)){
            var x = Double.parseDouble(xstr);
            var y= Double.parseDouble(ystr);
            var r = Integer.parseInt(rstr);
            ResultBean bean = (ResultBean) request.getSession().getAttribute("results");
            if(bean==null){
                bean = new ResultBean();
                request.getSession().setAttribute("results",bean);
            }
            boolean exists = bean.getResults().stream().anyMatch(
                    res -> res.getX() == x && res.getY() == y && res.getR() == r);
            if (!exists) {
                Result result = new Result(x, y, r, Checker.check(x, y, r));
                bean.addResult(result);
            }

            Result result = new Result(x,y,r,Checker.check(x,y,r));
            bean.addResult(result);
            long executionTime = (System.nanoTime() - startTime)/1000;
            //LocalDateTime.now().format(TIME_FORMATTER)

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            out.write(new Gson().toJson(result));
        }else{
            out.print("Invalid parameters");
        }
    }
}

