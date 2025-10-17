package bean;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class ResultBean implements Serializable {
    private List<Result> results;

    public ResultBean() {
        this.results = new ArrayList<>();
    }

    public void addResult(Result result) {
        this.results.add(0, result);
    }

    public void setResults(List<Result> results) {
        this.results = results;
    }

    public List<Result> getResults() {
        return results;
    }
}