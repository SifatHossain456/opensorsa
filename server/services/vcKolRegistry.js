// Curated Registry of Top Tier-1 Web3/Crypto Venture Capitals, Angels, & KOLs
// Used to match following/followers and assess real industry weight (similar to Sorsa Premium)

const VC_AND_KOL_REGISTRY = [
  // Tier 1 Venture Capital Funds & Institutions
  { handle: 'a16zcrypto', name: 'a16z crypto', type: 'VC', tier: 1, category: 'Venture Capital' },
  { handle: 'paradigm', name: 'Paradigm', type: 'VC', tier: 1, category: 'Venture Capital' },
  { handle: 'panteracapital', name: 'Pantera Capital', type: 'VC', tier: 1, category: 'Venture Capital' },
  { handle: 'binancelabs', name: 'Binance Labs Fund', type: 'VC', tier: 1, category: 'Venture Capital' },
  { handle: 'sequoia', name: 'Sequoia Capital', type: 'VC', tier: 1, category: 'Venture Capital' },
  { handle: 'dragonfly_xyz', name: 'Dragonfly', type: 'VC', tier: 1, category: 'Venture Capital' },
  { handle: 'coinbaseventures', name: 'Coinbase Ventures', type: 'VC', tier: 1, category: 'Venture Capital' },
  { handle: 'multicoincap', name: 'Multicoin Capital', type: 'VC', tier: 1, category: 'Venture Capital' },
  { handle: 'polychain', name: 'Polychain Capital', type: 'VC', tier: 1, category: 'Venture Capital' },
  { handle: 'jump_', name: 'Jump Crypto', type: 'VC', tier: 1, category: 'Market Maker / VC' },
  { handle: 'animocabrands', name: 'Animoca Brands', type: 'VC', tier: 1, category: 'Gaming / VC' },
  { handle: 'electriccapital', name: 'Electric Capital', type: 'VC', tier: 1, category: 'Venture Capital' },
  { handle: 'delphi_digital', name: 'Delphi Digital', type: 'VC', tier: 1, category: 'Research / VC' },
  { handle: 'wintermute_t', name: 'Wintermute', type: 'VC', tier: 1, category: 'Market Maker / VC' },
  { handle: '1kx_network', name: '1kx', type: 'VC', tier: 2, category: 'Venture Capital' },
  { handle: 'galaxyhq', name: 'Galaxy', type: 'VC', tier: 1, category: 'Institutional' },
  { handle: 'spartanblack_1', name: 'The Spartan Group', type: 'VC', tier: 2, category: 'Venture Capital' },
  { handle: 'hashed_official', name: 'Hashed', type: 'VC', tier: 2, category: 'Venture Capital' },
  { handle: 'robotventures', name: 'Robot Ventures', type: 'VC', tier: 1, category: 'Seed VC' },
  { handle: 'dwflabs', name: 'DWF Labs', type: 'VC', tier: 2, category: 'Market Maker / VC' },
  { handle: 'hashkeygroup', name: 'HashKey Group', type: 'VC', tier: 2, category: 'Institutional' },
  { handle: 'fabric_vc', name: 'Fabric Ventures', type: 'VC', tier: 2, category: 'Venture Capital' },
  { handle: 'placeholder_vc', name: 'Placeholder', type: 'VC', tier: 1, category: 'Venture Capital' },
  { handle: 'variantfund', name: 'Variant', type: 'VC', tier: 1, category: 'Venture Capital' },

  // Tier 1 Crypto Founders & Ecosystem Leaders
  { handle: 'vitalikbuterin', name: 'Vitalik Buterin', type: 'Founder', tier: 1, category: 'Ethereum' },
  { handle: 'cz_binance', name: 'CZ (Changpeng Zhao)', type: 'Founder', tier: 1, category: 'Binance' },
  { handle: 'brian_armstrong', name: 'Brian Armstrong', type: 'Founder', tier: 1, category: 'Coinbase' },
  { handle: 'aeyakovenko', name: 'Anatoly Yakovenko', type: 'Founder', tier: 1, category: 'Solana' },
  { handle: 'gavofyork', name: 'Gavin Wood', type: 'Founder', tier: 1, category: 'Polkadot / Ethereum' },
  { handle: 'haydenzadams', name: 'Hayden Adams', type: 'Founder', tier: 1, category: 'Uniswap' },
  { handle: 'stani_kulechov', name: 'Stani Kulechov', type: 'Founder', tier: 1, category: 'Aave / Lens' },
  { handle: 'elena_eth', name: 'Eleni', type: 'KOL', tier: 2, category: 'Research' },
  { handle: 'sandeepnailwal', name: 'Sandeep Nailwal', type: 'Founder', tier: 1, category: 'Polygon' },
  { handle: 'paoloardoino', name: 'Paolo Ardoino', type: 'Founder', tier: 1, category: 'Tether / Bitfinex' },
  { handle: 'jerallaire', name: 'Jeremy Allaire', type: 'Founder', tier: 1, category: 'Circle / USDC' },
  { handle: 'mert_', name: 'Mert Mumtaz', type: 'KOL', tier: 1, category: 'Helius / Solana' },
  { handle: 'balajis', name: 'Balaji Srinivasan', type: 'Angel', tier: 1, category: 'Angel Investor / Visionary' },
  { handle: 'cobie', name: 'Cobie', type: 'KOL', tier: 1, category: 'Top KOL / Echo' },
  { handle: 'crypto_bitlord7', name: 'Crypto Bitlord', type: 'KOL', tier: 2, category: 'Trader / KOL' },
  { handle: 'milesdeutscher', name: 'Miles Deutscher', type: 'KOL', tier: 1, category: 'Crypto Analyst' },
  { handle: 'muradmahmudov', name: 'Murad Mahmudov', type: 'KOL', tier: 1, category: 'Memecoin / Macro' },
  { handle: 'ansem', name: 'Ansem', type: 'KOL', tier: 1, category: 'Solana / Trader' },
  { handle: 'lookonchain', name: 'Lookonchain', type: 'Analytics', tier: 1, category: 'On-chain Intelligence' },
  { handle: 'zachxbt', name: 'ZachXBT', type: 'Investigator', tier: 1, category: 'On-chain Detective' },
  { handle: 'hsakatrades', name: 'Hsaka', type: 'KOL', tier: 1, category: 'High-volume Trader' },
  { handle: 'blknoiz06', name: 'Ansem Alternate', type: 'KOL', tier: 1, category: 'Trader' },
  { handle: 'Arthur_0x', name: 'Arthur Cheong', type: 'VC', tier: 1, category: 'DeFiance Capital' },
  { handle: 'chrisdixon', name: 'Chris Dixon', type: 'VC', tier: 1, category: 'a16z crypto' },
  { handle: 'packyM', name: 'Packy McCormick', type: 'KOL', tier: 2, category: 'Writer / Investor' },
  { handle: 'sassal0x', name: 'Anthony Sassano', type: 'KOL', tier: 1, category: 'The Daily Gwei' },
  { handle: 'hasufl', name: 'Hasu', type: 'Researcher', tier: 1, category: 'Flashbots / Paradigm' },
  { handle: 'tarunchitra', name: 'Tarun Chitra', type: 'Founder', tier: 1, category: 'Gauntlet' },
  { handle: 'udiwertheimer', name: 'Udi Wertheimer', type: 'KOL', tier: 1, category: 'Taproot Wizards' },
  { handle: 'ercwl', name: 'Eric Wall', type: 'KOL', tier: 1, category: 'Taproot Wizards' }
];

// Quick index map by lowercase handle
const REGISTRY_MAP = new Map();
VC_AND_KOL_REGISTRY.forEach(item => {
  REGISTRY_MAP.set(item.handle.toLowerCase(), item);
});

function matchVcAndKols(accountsList = []) {
  const matches = [];
  for (const acc of accountsList) {
    if (!acc) continue;
    const handle = (typeof acc === 'string' ? acc : (acc.screen_name || acc.handle || '')).toLowerCase();
    if (REGISTRY_MAP.has(handle)) {
      const info = REGISTRY_MAP.get(handle);
      matches.push({
        ...info,
        avatar: acc.avatar_url || acc.avatar || `https://unavatar.io/x/${info.handle}`,
        verified: acc.verification?.verified || false
      });
    }
  }
  return matches;
}

module.exports = {
  VC_AND_KOL_REGISTRY,
  REGISTRY_MAP,
  matchVcAndKols
};
