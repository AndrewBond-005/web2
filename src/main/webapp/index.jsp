<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<jsp:useBean id="results" scope="session" class="bean.ResultBean" />
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>1-я лаба по вебу</title>
	<meta name="author" content="Andrei Bondarenko">
	<link rel="icon" type="image/png" href="favicon.png">
	<link rel="stylesheet" href="styles.css">
</head>
<body>
<table id="main">
	<caption><b><h1>Лабораторная работа №2 по веб-программированию</h1></b></caption>
	<colgroup>
		<col id="col1">
		<col id="col2">
		<col id="col3">
	</colgroup>
	<thead>
	<tr>
		<th colspan="3">
			<header>Выполнил: Бондаренко Андрей Владимирович P3215 Вариант: 73301</header>
			<button id="themeTag">🌙</button>
		</th>
	</tr>
	</thead>
	<tr>
		<td id="inputcell">
			<form id="inputForm" method="get" action="/Web2/controller">
				<p>
					<label for="x"><b>X:</b></label>
					<input type="text" id="x" name="x" placeholder="число от -5 до 5">
					<label for="y"><b>Y:</b></label>
					<select id="yform" name="yform">
						<option value="-5">-5</option>
						<option value="-4">-4</option>
						<option value="-3">-3</option>
						<option value="-2">-2</option>
						<option value="-1">-1</option>
						<option value="0">0</option>
						<option value="1">1</option>
						<option value="2">2</option>
						<option value="3">3</option>
					</select>
				<p></p>
				<input type="hidden" id="y" name="y">
				<label><strong>R:</strong></label>
				<button type="button" id="r1" value="1" class="r-button">1</button>
				<button type="button" id="r2" value="2" class="r-button">2</button>
				<button type="button" id="r3" value="3" class="r-button">3</button>
				<button type="button" id="r4" value="4" class="r-button">4</button>
				<button type="button" id="r5" value="5" class="r-button">5</button>
				<input type="hidden" name="r" id="r-hidden">
				<input type="hidden" name="clear" id="clear">
				</p>
				<p>
					<input type="submit" value="Отправить" />
					<button type="button" id="clearButton">Удалить точки</button>
				</p>
				<table id="errorCell">
					<tr>
						<td><strong id="errorMessage"></strong></td>
					</tr>
				</table>
			</form>
		</td>
		<td id="areacell">
			<canvas id="canvas" width="333" height="333"></canvas>
		</td>
		<td>
			<table id="resultTable">
				<thead>
				<tr>
					<th>X</th>
					<th>Y</th>
					<th>R</th>
					<th>Результат</th>
					<th>Текущее время</th>
					<th>Время работы (мкс)</th>
				</tr>
				</thead>
				<tbody>
				<%
					java.util.List<bean.Result> resultList = results.getResults();
					for (bean.Result result : resultList) {
				%>
				<tr>
					<td><%= result.getX() %></td>
					<td><%= result.getY() %></td>
					<td><%= result.getR() %></td>
					<td class="<%= result.getIsHit() ? "yes" : "no" %>"><%= result.getIsHit() ? "попал" : "не попал" %></td>
					<td><%= result.getTime() %></td>
					<td><%= result.getExecutionTime() %></td>
				</tr>
				<%
					}
				%>
				</tbody>
			</table>
		</td>
	</tr>
	<tfoot>
	<tr>
		<th colspan="3">Copyright GOYDA© 2025. <a href="https://github.com/AndrewBond-005/web2">github</a></th>
	</tr>
	</tfoot>
</table>
<script type="module" src="js/main.js"></script>
</body>
</html>