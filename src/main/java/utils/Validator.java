package utils;

import java.util.Arrays;
import java.util.List;

public class Validator {
    private static final List<Double> ACCEPTABLE_Y = Arrays.asList(-5d, -4d, -3d, -2d, -1d, 0d, 1d, 2d, 3d);
    private static final List<Integer> ACCEPTABLE_R = Arrays.asList(1, 2, 3, 4, 5);
    private static final double MIN_X = -5d;
    private static final double MAX_X = 5d;
    public static boolean validate(String x, String y,String r) {
        try{
            var x1 = Double.parseDouble(x.replace(",", "."));
            var y1 = Double.parseDouble(y.replace(",", "."));
            var r1 = Integer.parseInt(r.replace(",", "."));
            if (!ACCEPTABLE_Y.contains(y1)) return false;
            if (x1 < MIN_X || x1 > MAX_X) return false;
            if (!ACCEPTABLE_R.contains(r1)) return false;
            return true;

        } catch (NumberFormatException e) {
            throw new RuntimeException(e);
        }
    }
}
