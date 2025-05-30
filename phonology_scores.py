import pandas as pd
import json

# Load core stats
df = pd.read_csv("docs/data/pokemon_stats.csv")

# Merge in phonology scores
df_en = pd.read_csv("temp_score_en.csv")
df_ja = pd.read_csv("temp_score_ja.csv")

df = df.merge(df_en, on=["id", "name_en"])
df = df.merge(df_ja, on=["id", "name_en"])

# Save updated CSV
df.to_csv("pokemon_stats.csv", index=False)
