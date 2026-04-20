/**
 * Catálogo de produtos da loja CobbleOpen.
 * Cada produto tem: id, name, price, description e commands(nick) → string[]
 * Os commands são executados via RCON após pagamento aprovado.
 */

const PRODUCTS = {
  /* ─── VIPs ─────────────────────────────────────── */
  vip_bulbasaur: {
    id: 'vip_bulbasaur',
    name: 'VIP Bulbasaur',
    price: 8.49,
    description: 'VIP Rank I — Bulbasaur',
    commands: (nick) => [
      `lp user ${nick} parent set vip_bulbasaur`,
      `title ${nick} times 10 60 10`,
      `title ${nick} title ["",{"text":"VIP ","color":"green","bold":true},{"text":"Bulbasaur","color":"dark_green","bold":true}]`,
      `title ${nick} subtitle {"text":"Bem-vindo ao CobbleOpen VIP!","color":"gray","italic":true}`,
      `playsound minecraft:ui.toast.challenge_complete master ${nick}`,
    ],
  },

  vip_charmander: {
    id: 'vip_charmander',
    name: 'VIP Charmander',
    price: 16.99,
    description: 'VIP Rank II — Charmander',
    commands: (nick) => [
      `lp user ${nick} parent set vip_charmander`,
      `title ${nick} times 10 60 10`,
      `title ${nick} title ["",{"text":"VIP ","color":"gold","bold":true},{"text":"Charmander","color":"red","bold":true}]`,
      `title ${nick} subtitle {"text":"Bem-vindo ao CobbleOpen VIP!","color":"gray","italic":true}`,
      `playsound minecraft:ui.toast.challenge_complete master ${nick}`,
    ],
  },

  vip_squirtle: {
    id: 'vip_squirtle',
    name: 'VIP Squirtle',
    price: 24.99,
    description: 'VIP Rank III — Squirtle',
    commands: (nick) => [
      `lp user ${nick} parent set vip_squirtle`,
      `title ${nick} times 10 60 10`,
      `title ${nick} title ["",{"text":"VIP ","color":"aqua","bold":true},{"text":"Squirtle","color":"blue","bold":true}]`,
      `title ${nick} subtitle {"text":"Bem-vindo ao CobbleOpen VIP!","color":"gray","italic":true}`,
      `playsound minecraft:ui.toast.challenge_complete master ${nick}`,
    ],
  },

  vip_pikachu: {
    id: 'vip_pikachu',
    name: 'VIP Pikachu',
    price: 37.99,
    description: 'VIP Rank IV — Pikachu',
    commands: (nick) => [
      `lp user ${nick} parent set vip_pikachu`,
      `title ${nick} times 10 60 10`,
      `title ${nick} title ["",{"text":"VIP ","color":"yellow","bold":true},{"text":"Pikachu","color":"gold","bold":true}]`,
      `title ${nick} subtitle {"text":"Bem-vindo ao CobbleOpen VIP!","color":"gray","italic":true}`,
      `playsound minecraft:ui.toast.challenge_complete master ${nick}`,
    ],
  },

  vip_charizard: {
    id: 'vip_charizard',
    name: 'VIP Charizard',
    price: 59.99,
    description: 'VIP Rank V — Charizard',
    commands: (nick) => [
      `lp user ${nick} parent set vip_charizard`,
      `title ${nick} times 10 60 10`,
      `title ${nick} title ["",{"text":"VIP ","color":"red","bold":true},{"text":"Charizard","color":"dark_red","bold":true}]`,
      `title ${nick} subtitle {"text":"Bem-vindo ao CobbleOpen VIP!","color":"gray","italic":true}`,
      `playsound minecraft:ui.toast.challenge_complete master ${nick}`,
    ],
  },

  vip_mewtwo: {
    id: 'vip_mewtwo',
    name: 'VIP Mewtwo',
    price: 99.99,
    description: 'VIP Rank LENDA — Mewtwo',
    commands: (nick) => [
      `lp user ${nick} parent set vip_mewtwo`,
      `title ${nick} times 10 80 10`,
      `title ${nick} title ["",{"text":"★ VIP ","color":"light_purple","bold":true},{"text":"MEWTWO","color":"dark_purple","bold":true},{"text":" ★","color":"light_purple","bold":true}]`,
      `title ${nick} subtitle {"text":"Rank Lendário ativado. Bem-vindo, Mestre!","color":"gray","italic":true}`,
      `playsound minecraft:ui.toast.challenge_complete master ${nick}`,
      `particle minecraft:witch ${nick} ~ ~2 ~ 1 1 1 0.05 100`,
    ],
  },

  /* ─── Upgrades VIP ──────────────────────────────── */
  upg_bulbasaur_charmander: {
    id: 'upg_bulbasaur_charmander',
    name: 'Upgrade Bulbasaur → Charmander',
    price: 8.99,
    description: 'Upgrade de VIP Bulbasaur para Charmander',
    commands: (nick) => [
      `lp user ${nick} parent set vip_charmander`,
      `title ${nick} title {"text":"Upgrade realizado!","color":"gold","bold":true}`,
    ],
  },

  upg_charmander_squirtle: {
    id: 'upg_charmander_squirtle',
    name: 'Upgrade Charmander → Squirtle',
    price: 8.49,
    description: 'Upgrade de VIP Charmander para Squirtle',
    commands: (nick) => [
      `lp user ${nick} parent set vip_squirtle`,
      `title ${nick} title {"text":"Upgrade realizado!","color":"aqua","bold":true}`,
    ],
  },

  upg_squirtle_pikachu: {
    id: 'upg_squirtle_pikachu',
    name: 'Upgrade Squirtle → Pikachu',
    price: 13.49,
    description: 'Upgrade de VIP Squirtle para Pikachu',
    commands: (nick) => [
      `lp user ${nick} parent set vip_pikachu`,
      `title ${nick} title {"text":"Upgrade realizado!","color":"yellow","bold":true}`,
    ],
  },

  upg_pikachu_charizard: {
    id: 'upg_pikachu_charizard',
    name: 'Upgrade Pikachu → Charizard',
    price: 22.49,
    description: 'Upgrade de VIP Pikachu para Charizard',
    commands: (nick) => [
      `lp user ${nick} parent set vip_charizard`,
      `title ${nick} title {"text":"Upgrade realizado!","color":"red","bold":true}`,
    ],
  },

  upg_charizard_mewtwo: {
    id: 'upg_charizard_mewtwo',
    name: 'Upgrade Charizard → Mewtwo',
    price: 40.49,
    description: 'Upgrade de VIP Charizard para Mewtwo',
    commands: (nick) => [
      `lp user ${nick} parent set vip_mewtwo`,
      `title ${nick} title {"text":"Upgrade para Mewtwo!","color":"light_purple","bold":true}`,
    ],
  },

  /* ─── Caixas Anime ──────────────────────────────── */
  caixa_anime_i: {
    id: 'caixa_anime_i',
    name: 'Caixa Anime I',
    price: 14.99,
    description: 'Caixa de Skin Anime I — 11 skins possíveis',
    commands: (nick) => [
      `cobbleopenskins givebox ${nick} 1`,
      `title ${nick} title {"text":"Caixa Anime I","color":"aqua","bold":true}`,
      `title ${nick} subtitle {"text":"Abra no inventário para revelar sua skin!","color":"gray"}`,
    ],
  },

  caixa_anime_i_x3: {
    id: 'caixa_anime_i_x3',
    name: 'Caixa Anime I × 3',
    price: 39.99,
    description: '3 Caixas de Skin Anime I',
    commands: (nick) => [
      `cobbleopenskins givebox ${nick} 3`,
      `title ${nick} title {"text":"3× Caixa Anime I","color":"aqua","bold":true}`,
    ],
  },

  caixa_anime_i_x5: {
    id: 'caixa_anime_i_x5',
    name: 'Caixa Anime I × 5',
    price: 59.99,
    description: '5 Caixas de Skin Anime I',
    commands: (nick) => [
      `cobbleopenskins givebox ${nick} 5`,
      `title ${nick} title {"text":"5× Caixa Anime I","color":"aqua","bold":true}`,
    ],
  },

  /* ─── Tokens de Skin ────────────────────────────── */
  token_mewtwo_goku: {
    id: 'token_mewtwo_goku',
    name: 'Token Mewtwo Goku',
    price: 49.99,
    description: 'Token de Skin Lendária — Mewtwo Goku',
    commands: (nick) => [
      `cobbleopenskins givetoken ${nick} mewtwo_goku 1`,
      `title ${nick} title ["",{"text":"✦ ","color":"gold"},{"text":"Skin Lendária","color":"yellow","bold":true},{"text":" ✦","color":"gold"}]`,
      `title ${nick} subtitle {"text":"Token Mewtwo Goku obtido!","color":"gray"}`,
      `playsound minecraft:ui.toast.challenge_complete master ${nick}`,
    ],
  },

  token_ninetales_kurama: {
    id: 'token_ninetales_kurama',
    name: 'Token Ninetales Kurama',
    price: 49.99,
    description: 'Token de Skin Lendária — Ninetales Kurama',
    commands: (nick) => [
      `cobbleopenskins givetoken ${nick} ninetales_kurama 1`,
      `title ${nick} title ["",{"text":"✦ ","color":"gold"},{"text":"Skin Lendária","color":"yellow","bold":true},{"text":" ✦","color":"gold"}]`,
      `title ${nick} subtitle {"text":"Token Ninetales Kurama obtido!","color":"gray"}`,
      `playsound minecraft:ui.toast.challenge_complete master ${nick}`,
    ],
  },

  token_zoroark_sasuke: {
    id: 'token_zoroark_sasuke',
    name: 'Token Zoroark Sasuke',
    price: 29.99,
    description: 'Token de Skin Épica — Zoroark Sasuke',
    commands: (nick) => [
      `cobbleopenskins givetoken ${nick} zoroark_sasuke 1`,
      `title ${nick} title {"text":"Skin Épica obtida!","color":"light_purple","bold":true}`,
    ],
  },

  token_greninja_kakashi: {
    id: 'token_greninja_kakashi',
    name: 'Token Greninja Kakashi',
    price: 29.99,
    description: 'Token de Skin Épica — Greninja Kakashi',
    commands: (nick) => [
      `cobbleopenskins givetoken ${nick} greninja_kakashi 1`,
      `title ${nick} title {"text":"Skin Épica obtida!","color":"light_purple","bold":true}`,
    ],
  },

  token_lucario_gohan: {
    id: 'token_lucario_gohan',
    name: 'Token Lucario Gohan',
    price: 29.99,
    description: 'Token de Skin Épica — Lucario Gohan',
    commands: (nick) => [
      `cobbleopenskins givetoken ${nick} lucario_gohan 1`,
      `title ${nick} title {"text":"Skin Épica obtida!","color":"light_purple","bold":true}`,
    ],
  },

  token_alakazam_gojo: {
    id: 'token_alakazam_gojo',
    name: 'Token Alakazam Gojo',
    price: 19.99,
    description: 'Token de Skin Rara — Alakazam Gojo',
    commands: (nick) => [
      `cobbleopenskins givetoken ${nick} alakazam_gojo 1`,
      `title ${nick} title {"text":"Skin Rara obtida!","color":"dark_purple","bold":true}`,
    ],
  },

  token_gengar_sukuna: {
    id: 'token_gengar_sukuna',
    name: 'Token Gengar Sukuna',
    price: 19.99,
    description: 'Token de Skin Rara — Gengar Sukuna',
    commands: (nick) => [
      `cobbleopenskins givetoken ${nick} gengar_sukuna 1`,
      `title ${nick} title {"text":"Skin Rara obtida!","color":"dark_purple","bold":true}`,
    ],
  },

  /* ─── Pokémon ───────────────────────────────────── */
  poke_bulbasaur: {
    id: 'poke_bulbasaur',
    name: 'Bulbasaur Nv.50',
    price: 9.99,
    description: 'Pokémon Bulbasaur Nível 50',
    commands: (nick) => [`pokegive ${nick} bulbasaur level:50`],
  },

  poke_charmander: {
    id: 'poke_charmander',
    name: 'Charmander Nv.50',
    price: 9.99,
    description: 'Pokémon Charmander Nível 50',
    commands: (nick) => [`pokegive ${nick} charmander level:50`],
  },

  poke_squirtle: {
    id: 'poke_squirtle',
    name: 'Squirtle Nv.50',
    price: 9.99,
    description: 'Pokémon Squirtle Nível 50',
    commands: (nick) => [`pokegive ${nick} squirtle level:50`],
  },

  poke_chikorita: {
    id: 'poke_chikorita',
    name: 'Chikorita Nv.50',
    price: 9.99,
    description: 'Pokémon Chikorita Nível 50',
    commands: (nick) => [`pokegive ${nick} chikorita level:50`],
  },

  poke_dragonite: {
    id: 'poke_dragonite',
    name: 'Dragonite Nv.70',
    price: 24.99,
    description: 'Pokémon Dragonite Nível 70',
    commands: (nick) => [`pokegive ${nick} dragonite level:70`],
  },

  poke_tyranitar: {
    id: 'poke_tyranitar',
    name: 'Tyranitar Nv.70',
    price: 24.99,
    description: 'Pokémon Tyranitar Nível 70',
    commands: (nick) => [`pokegive ${nick} tyranitar level:70`],
  },

  poke_garchomp: {
    id: 'poke_garchomp',
    name: 'Garchomp Nv.70',
    price: 24.99,
    description: 'Pokémon Garchomp Nível 70',
    commands: (nick) => [`pokegive ${nick} garchomp level:70`],
  },

  poke_articuno: {
    id: 'poke_articuno',
    name: 'Articuno Nv.70',
    price: 39.99,
    description: 'Pokémon Lendário Articuno Nível 70',
    commands: (nick) => [`pokegive ${nick} articuno level:70 ivs:31,31,31,x,x,x`],
  },

  poke_mewtwo: {
    id: 'poke_mewtwo',
    name: 'Mewtwo Nv.100',
    price: 59.99,
    description: 'Pokémon Lendário Mewtwo Nível 100 IVs 6×31',
    commands: (nick) => [`pokegive ${nick} mewtwo level:100 ivs:31,31,31,31,31,31`],
  },

  poke_lugia: {
    id: 'poke_lugia',
    name: 'Lugia Nv.70',
    price: 49.99,
    description: 'Pokémon Lendário Lugia Nível 70',
    commands: (nick) => [`pokegive ${nick} lugia level:70 ivs:31,31,31,31,x,x`],
  },

  poke_pikachu_shiny: {
    id: 'poke_pikachu_shiny',
    name: 'Pikachu Shiny Nv.50',
    price: 19.99,
    description: 'Pokémon Pikachu Shiny Nível 50',
    commands: (nick) => [`pokegive ${nick} pikachu level:50 shiny:true`],
  },

  poke_charizard_shiny: {
    id: 'poke_charizard_shiny',
    name: 'Charizard Shiny Nv.70',
    price: 44.99,
    description: 'Pokémon Charizard Shiny Nível 70',
    commands: (nick) => [`pokegive ${nick} charizard level:70 shiny:true`],
  },

  poke_gyarados_shiny: {
    id: 'poke_gyarados_shiny',
    name: 'Gyarados Shiny Nv.60',
    price: 34.99,
    description: 'Pokémon Gyarados Shiny Nível 60',
    commands: (nick) => [`pokegive ${nick} gyarados level:60 shiny:true`],
  },

  /* ─── Pacotes ───────────────────────────────────── */
  pacote_iniciante: {
    id: 'pacote_iniciante',
    name: 'Pacote Iniciante',
    price: 29.99,
    description: 'Pacote Iniciante — 3 iniciais + caixa + VIP',
    commands: (nick) => [
      `pokegive ${nick} bulbasaur level:50`,
      `pokegive ${nick} charmander level:50`,
      `pokegive ${nick} squirtle level:50`,
      `cobbleopenskins givebox ${nick} 1`,
      `eco give ${nick} 1000`,
      `lp user ${nick} parent set vip_bulbasaur`,
      `title ${nick} title {"text":"Pacote Iniciante!","color":"green","bold":true}`,
      `playsound minecraft:ui.toast.challenge_complete master ${nick}`,
    ],
  },

  pacote_aventureiro: {
    id: 'pacote_aventureiro',
    name: 'Pacote Aventureiro',
    price: 64.99,
    description: 'Pacote Aventureiro — 5 Pokémon Nv.70 + 3 caixas + VIP Squirtle',
    commands: (nick) => [
      `pokegive ${nick} dragonite level:70`,
      `pokegive ${nick} tyranitar level:70`,
      `pokegive ${nick} garchomp level:70`,
      `pokegive ${nick} gengar level:70`,
      `pokegive ${nick} lucario level:70`,
      `cobbleopenskins givebox ${nick} 3`,
      `eco give ${nick} 5000`,
      `lp user ${nick} parent set vip_squirtle`,
      `title ${nick} title {"text":"Pacote Aventureiro!","color":"aqua","bold":true}`,
      `playsound minecraft:ui.toast.challenge_complete master ${nick}`,
    ],
  },

  pacote_campeao: {
    id: 'pacote_campeao',
    name: 'Pacote Campeão',
    price: 129.99,
    description: 'Pacote Campeão — 3 Lendários 6×31 + 5 caixas + Token Épico + VIP Pikachu',
    commands: (nick) => [
      `pokegive ${nick} mewtwo level:100 ivs:31,31,31,31,31,31`,
      `pokegive ${nick} lugia level:100 ivs:31,31,31,31,31,31`,
      `pokegive ${nick} articuno level:100 ivs:31,31,31,31,31,31`,
      `cobbleopenskins givebox ${nick} 5`,
      `cobbleopenskins givetoken ${nick} zoroark_sasuke 1`,
      `eco give ${nick} 10000`,
      `lp user ${nick} parent set vip_pikachu`,
      `title ${nick} title ["",{"text":"★ ","color":"gold"},{"text":"Pacote Campeão!","color":"yellow","bold":true},{"text":" ★","color":"gold"}]`,
      `playsound minecraft:ui.toast.challenge_complete master ${nick}`,
    ],
  },

  /* ─── PokéCoins ─────────────────────────────────── */
  coins_1000: {
    id: 'coins_1000',
    name: '1.000 PokéCoins',
    price: 4.99,
    description: '1.000 PokéCoins para a loja in-game',
    commands: (nick) => [`eco give ${nick} 1000`],
  },

  coins_5000: {
    id: 'coins_5000',
    name: '5.000 PokéCoins',
    price: 19.99,
    description: '5.000 PokéCoins para a loja in-game',
    commands: (nick) => [`eco give ${nick} 5000`],
  },

  coins_15000: {
    id: 'coins_15000',
    name: '15.000 PokéCoins',
    price: 49.99,
    description: '15.000 PokéCoins para a loja in-game',
    commands: (nick) => [`eco give ${nick} 15000`],
  },

  coins_50000: {
    id: 'coins_50000',
    name: '50.000 PokéCoins',
    price: 149.99,
    description: '50.000 PokéCoins para a loja in-game',
    commands: (nick) => [`eco give ${nick} 50000`],
  },
};

module.exports = { PRODUCTS };
