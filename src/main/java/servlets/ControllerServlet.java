package servlets;

import bean.Result;
import com.google.gson.Gson;

import jakarta.servlet.ServletException; // Changed to jakarta
import jakarta.servlet.annotation.WebServlet; // Changed
import jakarta.servlet.http.HttpServlet; // Changed
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import utils.Checker;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;
@WebServlet("/controller")
public class ControllerServlet extends HttpServlet {
    //document.getElementById('r-hidden').value = Rnew;
    //const response = await fetch("/controller?" + params.toString());
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
           try {
            if (request.getParameter("x") != null && request.getParameter("y") != null && request.getParameter("r") != null) {
                request.getRequestDispatcher("./check").forward(request, response);
            } else {
                request.getRequestDispatcher("./index.jsp").forward(request, response);
            }
        } catch (ServletException | IOException e) {
               var json = new Gson();
               Map<String, Object> jsonResponse = new HashMap<>() {{
                   put("error", e.getMessage());
                   put("SC_INTERNAL_SERVER_ERROR", "Internal Server Error");
               }};
               response.setContentType("application/json");
               response.getWriter().write(json.toJson(jsonResponse));
               response.setStatus(500);
        }

    }
}
