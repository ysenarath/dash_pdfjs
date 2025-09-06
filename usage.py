import dash_pdfjs
from dash import Dash, callback, html, Input, Output

app = Dash(__name__)

app.layout = html.Div(
    [
        dash_pdfjs.ExampleTextbox(id="input", value="my-value", label="my-label"),
        html.Div(id="output"),
        # PdfHighlighter
        dash_pdfjs.PdfHighlighter(
            id="pdf-viewer",
            # public url
            src="https://arxiv.org/pdf/1708.08021.pdf",
            highlights=[],
            style={"height": "90vh", "border": "1px solid #ccc"},
        ),
    ]
)


@callback(Output("output", "children"), Input("input", "value"))
def display_output(value):
    return "You have entered {}".format(value)


if __name__ == "__main__":
    app.run(debug=True)
