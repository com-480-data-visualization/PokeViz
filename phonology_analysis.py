import pandas as pd

# vowel strenght high to low (a, o, e, u i)
vowel_strength = {
    'ア': 5, 'オ': 4, 'エ': 3, 'ウ': 2, 'イ': 1,
    'ァ': 5, 'ォ': 4, 'ェ': 3, 'ゥ': 2, 'ィ': 1,
    'カ': 5, 'コ': 4, 'ケ': 3, 'ク': 2, 'キ': 1,
    'サ': 5, 'ソ': 4, 'セ': 3, 'ス': 2, 'シ': 1,
    'タ': 5, 'ト': 4, 'テ': 3, 'ツ': 2, 'チ': 1,
    'ナ': 5, 'ノ': 4, 'ネ': 3, 'ヌ': 2, 'ニ': 1,
    'ハ': 5, 'ホ': 4, 'ヘ': 3, 'フ': 2, 'ヒ': 1,
    'マ': 5, 'モ': 4, 'メ': 3, 'ム': 2, 'ミ': 1,
    'ヤ': 5, 'ヨ': 4, 'エ': 3, 'ユ': 2, 'イ': 1,
    'ラ': 5, 'ロ': 4, 'レ': 3, 'ル': 2, 'リ': 1,
    'ワ': 5, 'ヲ': 4, 'エ': 3, 'ウ': 2, 'イ': 1,
    'ガ': 5, 'ゴ': 4, 'ゲ': 3, 'グ': 2, 'ギ': 1,
    'ザ': 5, 'ゾ': 4, 'ゼ': 3, 'ズ': 2, 'ジ': 1,
    'ダ': 5, 'ド': 4, 'デ': 3, 'ヅ': 2, 'ヂ': 1,
    'バ': 5, 'ボ': 4, 'ベ': 3, 'ブ': 2, 'ビ': 1,
    'パ': 5, 'ポ': 4, 'ペ': 3, 'プ': 2, 'ピ': 1,
}

# voiced obstruents /b/, /d/, /g/, /z/ (all series) → heaviness and largeness 
voiced_obstruents = {'バ', 'ビ', 'ブ', 'ベ', 'ボ',
                    'ガ', 'ギ', 'グ', 'ゲ', 'ゴ',
                    'ザ', 'ジ', 'ズ', 'ゼ', 'ゾ',
                    'ダ', 'ヂ', 'ヅ', 'デ', 'ド'}

# small katakana (ya, yu, yo) → lightness and smallness
# note: small katakana are not counted in mora count
small_katakana = {'ァ', 'ィ', 'ゥ', 'ェ', 'ォ', 'ャ', 'ュ', 'ョ'}


# generalizing mora count as katakana character spelling
def count_moras(katakana_name):
    
    return len(katakana_name)- sum(1 for char in katakana_name if char in small_katakana)

def count_vowel_strength(katakana_name):
    processed_name = []
    for i, char in enumerate(katakana_name):
        if char == 'ー':
            if i > 0:
                processed_name.append(katakana_name[i - 1])
        else:
            processed_name.append(char)
    
    return sum(vowel_strength.get(char, 0) for char in processed_name)

df = pd.read_csv("pokemon_stats.csv")

phonology_data = []

for _, row in df.iterrows():
    name_ja = row['name_ja']
    
    vowel_score = count_vowel_strength(name_ja)
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
