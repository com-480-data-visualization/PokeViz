import requests
import pandas as pd
import time

def fetch_pokemon(limit=1000):
    url = f"https://pokeapi.co/api/v2/pokemon?limit={limit}"
    response = requests.get(url).json()
    results = response['results']

    data = []
    for poke in results:
        res = requests.get(poke['url']).json()
        species_url = res['species']['url']
        species_data = requests.get(species_url).json()
        ja_name = next((n['name'] for n in species_data['names'] if n['language']['name'] == 'ja'), None)

        evo_chain_url = species_data['evolution_chain']['url']
        evo_data = requests.get(evo_chain_url).json()

        # evolution stage (0 = base, 1 = 1st evolve, 2 = final)
        def get_evo_stage(chain, name, stage=0):
            if chain['species']['name'] == name:
                return stage
            for evo in chain.get('evolves_to', []):
                result = get_evo_stage(evo, name, stage + 1)
                if result != -1:
                    return result
            return -1

        evolution_stage = get_evo_stage(evo_data['chain'], res['name'])

        data.append({
            'id': res['id'],
            'name_en': res['name'],
            'name_ja': ja_name,
            'base_stat_total': sum(stat['base_stat'] for stat in res['stats']),
            'hp': res['stats'][0]['base_stat'],
            'attack': res['stats'][1]['base_stat'],
            'defense': res['stats'][2]['base_stat'],
            'special-attack': res['stats'][3]['base_stat'],
            'special-defense': res['stats'][4]['base_stat'],
            'speed': res['stats'][5]['base_stat'],
            'types': ','.join(t['type']['name'] for t in res['types']),
            'sprite_url': res['sprites']['front_default'],
            'generation': species_data['generation']['name'],
            'evolution_stage': evolution_stage,
            'is_legendary': species_data['is_legendary'],
            'is_mythical': species_data['is_mythical']
        })
        time.sleep(0.2)

    df = pd.DataFrame(data)
    df.to_csv('pokemon_stats.csv', index=False)

if __name__ == "__main__":
    fetch_pokemon()
