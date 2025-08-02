from flask import Flask, render_template, request
import requests
import os


app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def home():
    meals = []
    if request.method == 'POST':
        ingredient = request.form.get('ingredient', '').strip().lower()
        if ingredient:
            url = f'https://www.themealdb.com/api/json/v1/1/filter.php?i={ingredient}'
            response = requests.get(url)
            data = response.json()
            meals = data.get('meals', [])  # Será [] si no hay resultados

    return render_template('home.html', meals=meals)

@app.route('/recipe/<meal_id>')
def recipe(meal_id):
    url = f'https://www.themealdb.com/api/json/v1/1/lookup.php?i={meal_id}'
    response = requests.get(url)
    data = response.json()
    meal = data['meals'][0] if data['meals'] else None
    return render_template('recipe.html', meal=meal)

if __name__ == "__main__":
    app.run(debug=True)
