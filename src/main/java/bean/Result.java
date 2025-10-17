package bean;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

public class Result implements Serializable {
    private double x;
    private double y;
    private int r;
    private boolean isHit;
    private String time;
    private long executionTime;

    public long getExecutionTime() {
        return executionTime;
    }

    public void setExecutionTime(long executionTime) {
        this.executionTime = executionTime;
    }


    public Result(double x, double y, int r, boolean isHit, String time, long executionTime) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.isHit = isHit;
        this.time = time;
        this.executionTime = executionTime;
    }

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    public int getR() {
        return r;
    }

    public void setR(int r) {
        this.r = r;
    }

    public boolean getIsHit() {
        return isHit;
    }

    public void setIsHit(boolean hit) {
        this.isHit = hit;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public boolean isHit() {
        return isHit;
    }

    public void setHit(boolean hit) {
        isHit = hit;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Result result = (Result) o;
        return isHit == result.isHit &&
                x == result.x &&
                y == result.y &&
                r == result.r &&
                time== result.time &&
                executionTime == result.executionTime;
    }

    @Override
    public int hashCode() {
        return Objects.hash(x, y, r, isHit, time, executionTime);
    }

    @Override
    public String toString() {
        return "Result{" +
                "x='" + x + '\'' +
                ", y='" + y + '\'' +
                ", r='" + r + '\'' +
                ", isHit=" + isHit +
                ", time=" + time +
                ", executionTime=" + executionTime +
                '}';
    }
}
