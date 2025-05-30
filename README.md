# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
|Aayush Desai|403830|
|Nivedita Rethnakar|403841|
|Takashi Kosaku|402812|

[Milestone 1](#milestone-1) • [Milestone 2](#milestone-2) • [Milestone 3](#milestone-3)

## Milestone 1 (21st March, 5pm)

**10% of the final grade**

This is a preliminary milestone to let you set up goals for your final project and assess the feasibility of your ideas.
Please, fill the following sections about your project.

*(max. 2000 characters per section)*

### Dataset

[Pokédex For All 1025 Pokémon](https://www.kaggle.com/datasets/rzgiza/pokdex-for-all-1025-pokemon-w-text-description)

### Problematic

> Frame the general topic of your visualization and the main axis that you want to develop.
> - What am I trying to show with my visualization?
>   - The goal of our project is to explore how Pokémon stats and design characteristics have evolved across generations, and whether there is a connection between the way a Pokémon’s name sounds and its perceived power or evolutionary status. We’re especially interested in identifying naming patterns—do stronger or more evolved Pokémon tend to have “heavier” sounding names? And how has the stat distribution shifted from Generation 1 to Generation 10?  
>   
> - Think of an overview for the project, your motivation, and the target audience.
>   - The final output will be an interactive, Pokédex-style web app that lets users explore these patterns through intuitive visualizations. Our target audience includes Pokémon fans, data visualization learners, and anyone curious about how sound symbolism and design trends intersect in long-running franchises like Pokémon.

### Exploratory Data Analysis

Can be found in the `/eda` folder!

### Related work


> - What others have already done with the data?  
>   - Our project builds on a study by Shigeto Kawahara (2018), which found that voiced sounds in Japanese Pokémon names tend to signal strength and size. While this linguistic idea has been academically discussed, it hasn’t been widely visualized or combined with broader stat data across all generations. On the data side, we’ve seen YouTube creators use animation to explore Pokémon stats and size comparisons, but these are often informal and not interactive. We aim to take that style of presentation and add analytical depth by connecting phonology to game stats.  
>
> - Why is your approach original?  
>   - What makes our project original is its integration of linguistic features from Japanese name data with visualizations of stat and design trends across generations. To our knowledge, no existing visualization tool explores this specific intersection.  
>
> - What source of inspiration do you take? Visualizations that you found on other websites or magazines (might be unrelated to your data).  
>   - [Using VFX to Reveal the True Scale of Pokémon](https://www.youtube.com/watch?v=m2UohoQ5GJI)  
>   - [Kawahara’s study on sound symbolism in Pokémon names (2018)](https://www.degruyter.com/document/doi/10.1159/000484938/html)  
>
> - In case you are using a dataset that you have already explored in another context (ML or ADA course, semester project...), you are required to share the report of that work to outline the differences with the submission for this class.  
>   - This dataset has not been previously explored in another course context.

## Milestone 2 (18th April, 5pm)

**10% of the final grade**

### Project Goal & Current Visualizations
We've decided to get ahead on the actual MVP implementation for the website in order to spend more time focusing on the linguistic portion, which will require some additional data aggregation/processing on our end (but we believe will be well worth the effort to tell an interesting story!). So far, we've implemented the basis of an [interactive Pokédex](https://com-480-data-visualization.github.io/PokeViz/) which allows users to:
- View base stats for any of the 1025 Pokémon in the franchise (Generations 1-9) ![image](https://github.com/user-attachments/assets/3fb01425-964a-4af0-b342-241c8a5d3aca)

- Navigate an interactive bar graph displaying the top `n` Pokémon for any given stat, with the ability to filter by type and generation ![image](https://github.com/user-attachments/assets/f4a2e81f-8008-495b-a1ed-162c341dda13)

- Observe a rudimentary correlation between Pokémon stat total and their cumulative phonology score, which is our own metric derived from the paper referenced in Milestone 1 (see `phonology_analysis.py`)  ![image](https://github.com/user-attachments/assets/a70f591a-e48f-44a2-9150-54da9a8aaa7f)

These visualizations were built mainly drawing inspiration from these lectures:
- [D3.js](https://moodle.epfl.ch/pluginfile.php/2320166/mod_resource/content/0/4_2_D3.pdf)
  - Selection methods, append(), enter(), reading CSVs, fetching from PokéAPI
- [Interactions](https://moodle.epfl.ch/pluginfile.php/2321913/mod_resource/content/0/5_1_Interaction.pdf)
  - Incremental text search
- [More Interactive D3](https://moodle.epfl.ch/pluginfile.php/2321914/mod_resource/content/0/5_2_More_interactive_d3.pdf)
  - Scales, Axes, Max-Min, Transform, Event Listeners
- [Tabular Data](https://moodle.epfl.ch/pluginfile.php/2483604/mod_resource/content/0/11_1_Tabular_data.pdf)
  - Scatterplots, Dot Charts, Bar Charts

### Planned Extra Features
As previously mentioned we want the linguistic component to be a prominent highlight of this project, so we'll be dedicating quite a bit of time moving forward to improving those specific visualizations and drawing comparisons between Japanese and English name strengths, some of which will require collecting that data ourselves (which should not be very time-consuming). Specifically, we want to determine if there is a similar positive correlation between phonology score and Pokémon metrics w.r.t. English Pokémon names as well. Some other nice-to-have but non-essential features we'd like to include are:
- Making a playable Pokémon character that is able to run around and "discover" different visualizations, in the style of Pokémon games
- A map of all the franchise's regions displaying the geographical distribution of Pokémon
- 3D visualizations for height comparisons between Pokémon
- General bug fixes and beautifying the UI (consistent Pokémon-themed color/font schema, background, animations, etc.)

## Milestone 3 (30th May, 5pm)

**80% of the final grade**

### Final Implementation Summary (Milestone 3)

In Milestone 3, we focused on realizing the core ideas outlined in Milestone 2, particularly enhancing the linguistic visualizations and overall user experience. We implemented the following:

- **Phonology Comparison**: Added new visualizations comparing phonology scores and stat totals for both Japanese and English Pokémon names, based on our manually collected data.
- **Design Improvements**: Refined the UI with a consistent Pokémon-inspired color palette, updated typography, and custom background elements.
- **Interactive Enhancements**: Improved interactivity with smoother transitions, tooltip updates, and responsive layout adjustments across devices.
- **Documentation**: Prepared a process book detailing the design and development journey, as well as a screencast highlighting the final product.

These changes helped us deliver a cohesive and engaging interactive Pokédex that connects linguistic features with game design trends across generations.

### How to open the Process Book

The Process Book is included as a PDF file in this repository.

To read it:

1. Download or clone this repository.
2. Locate the file named: `process_book.pdf`
3. Open it with any PDF reader (e.g., Preview on macOS, Adobe Reader, browser PDF viewer).

Alternatively, you can [view the PDF directly on GitHub](./process_book.pdf).

---

### How to run the Web App locally

To view the interactive Pokédex web application on your local machine:

#### Step 1: Clone this repository

```bash
git clone https://github.com/com-480-data-visualization/PokeViz.git
cd PokeViz/docs/
```

#### Step 2: Start a local HTTP server

If you have Python installed:

```bash
# For Python 3.x
python -m http.server 8000
```
This will start a local server at port 8000.

#### Step 3: Open the app in your browser
Visit the following URL in your browser:

````
http://localhost:8000/
````
Now you can explore all the visualizations in a local environment.

## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone

