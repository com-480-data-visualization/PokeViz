import pandas as pd

# vowel strenght high to low (a, o, e, u i)
vowel_strength = {
    'ア': 5, 'オ': 4, 'エ': 3, 'ウ': 2, 'イ': 1,
    'ァ': 5, 'ォ': 4, 'ェ': 3, 'ゥ': 2, 'ィ': 1,
}

# voiced obstruents /b/, /d/, /g/, /z/ (all series) → heaviness and largeness 
voiced_obstruents = {'バ', 'ビ', 'ブ', 'ベ', 'ボ',
                     'ガ', 'ギ', 'グ', 'ゲ', 'ゴ',
                     'ザ', 'ジ', 'ズ', 'ゼ', 'ゾ',
                     'ダ', 'ヂ', 'ヅ', 'デ', 'ド'}

# generalizing mora count as katakana character spelling
def count_moras(katakana_name):
    return len(katakana_name)

df = pd.read_csv("pokemon_stats.csv")

phonology_data = []

for _, row in df.iterrows():
    name_ja = row['name_ja']
    
    vowel_score = sum(vowel_strength.get(char, 0) for char in name_ja)
    obstruent_count = sum(1 for char in name_ja if char in voiced_obstruents)
    mora_count = count_moras(name_ja)
    total_score = vowel_score + obstruent_count + mora_count

    phonology_data.append({
        "id": row["id"],
        "name_en": row["name_en"],
        "name_ja": name_ja,
        "vowel_score": vowel_score,
        "voiced_obstruents": obstruent_count,
        "mora_count": mora_count,
        "total_score": total_score
    })

phon_df = pd.DataFrame(phonology_data)
phon_df.to_csv("pokemon_phonology.csv", index=False)
print("saved")
