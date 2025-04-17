from g2p_en import G2p
import pandas as pd
import nltk
nltk.download('averaged_perceptron_tagger_eng')
g2p = G2p()

coronal_phonemes = {'T', 'D', 'S', 'Z', 'N', 'L', 'R', 'TH', 'DH', 'CH', 'JH', 'SH', 'ZH'}

def analyze_name(name):
    phonemes = [p for p in g2p(name) if p.isalpha()]
    segment_count = len(phonemes)
    a_count = phonemes.count("AA")
    u_count = phonemes.count("UW")
    coronal_count = sum(1 for p in phonemes if p in coronal_phonemes)
    total_score = segment_count + a_count + u_count + coronal_count
    return segment_count, a_count, u_count, coronal_count, total_score

df = pd.read_csv("pokemon_stats.csv")

results = df["name_en"].apply(analyze_name)
df[["segment_count", "a_count", "u_count", "coronal_count", "total_score_en"]] = pd.DataFrame(results.tolist(), index=df.index)

df.to_csv("pokemon_phonology_en.csv", index=False)
print("Saved：pokemon_phonology_en.csv")

