from flask import Flask, jsonify
import pandas as pd

app = Flask(__name__)
df = pd.read_json('backend/phonodex_data.json')

@app.route('/api/pokemon')
def all_pokemon():
    return jsonify(df.to_dict(orient='records'))

@app.route('/api/top_heavy')
def top_heavy():
    top = df.sort_values(by='heaviness_score', ascending=False).head(10)
    return jsonify(top.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=True)