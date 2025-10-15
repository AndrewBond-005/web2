package utils;
public class Checker {
    public static boolean check(double x,double y,int r) {
        if (x >= 0 && y <= 0 && x * x + y * y <= r * r) return true;
        if (x >= 0 && x*2 <= r && y >= 0 && y <= r) return true;
        if (x <= 0 && y <= 0 && 2 * y >= 2*x-r) return true;
        return false;
    }
}
