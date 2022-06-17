from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

with app.app_context():
    # LOCAL
    import routes

    app.register_blueprint(routes.bp)

CORS(app)


if __name__ == "__main__":
    app.run()
