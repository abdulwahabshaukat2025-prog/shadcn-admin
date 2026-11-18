// Source: World Bank, World Development Indicators (SP.POP.TOTL, "Population, total"),
// last updated 07/01/2020. Licensed CC BY-4.0. Mid-year estimates.
// Generated from "Latin America Population.xlsx". Do not edit by hand.

export type Subregion = 'south' | 'central' | 'caribbean'

export interface CountrySeries {
  code: string
  iso2: string
  name: string
  subregion: Subregion
  /** Population for each year in YEARS, in people. */
  values: number[]
}

export const YEARS = [
  2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019,
] as const

export const COUNTRIES: CountrySeries[] = [
  {
    code: 'BRA',
    iso2: 'br',
    name: 'Brazil',
    subregion: 'south',
    values: [
      195713635, 197514534, 199287296, 201035903, 202763735, 204471769,
      206163058, 207833831, 209469333, 211049527,
    ],
  },
  {
    code: 'MEX',
    iso2: 'mx',
    name: 'Mexico',
    subregion: 'central',
    values: [
      114092963, 115695473, 117274155, 118827161, 120355128, 121858258,
      123333376, 124777324, 126190788, 127575529,
    ],
  },
  {
    code: 'COL',
    iso2: 'co',
    name: 'Colombia',
    subregion: 'south',
    values: [
      45222700, 45663099, 46076848, 46497267, 46969209, 47520667, 48171392,
      48901066, 49648685, 50339443,
    ],
  },
  {
    code: 'ARG',
    iso2: 'ar',
    name: 'Argentina',
    subregion: 'south',
    values: [
      40788453, 41261490, 41733271, 42202935, 42669500, 43131966, 43590368,
      44044811, 44494502, 44938712,
    ],
  },
  {
    code: 'PER',
    iso2: 'pe',
    name: 'Peru',
    subregion: 'south',
    values: [
      29027674, 29264318, 29506788, 29773987, 30090359, 30470734, 30926032,
      31444297, 31989256, 32510453,
    ],
  },
  {
    code: 'VEN',
    iso2: 've',
    name: 'Venezuela',
    subregion: 'south',
    values: [
      28439940, 28888369, 29362449, 29783571, 30045134, 30081829, 29846179,
      29390409, 28870195, 28515829,
    ],
  },
  {
    code: 'CHL',
    iso2: 'cl',
    name: 'Chile',
    subregion: 'south',
    values: [
      17062536, 17233576, 17400347, 17571507, 17758959, 17969353, 18209068,
      18470439, 18729160, 18952038,
    ],
  },
  {
    code: 'ECU',
    iso2: 'ec',
    name: 'Ecuador',
    subregion: 'south',
    values: [
      15011117, 15243883, 15474102, 15707474, 15951838, 16212020, 16491115,
      16785361, 17084357, 17373662,
    ],
  },
  {
    code: 'GTM',
    iso2: 'gt',
    name: 'Guatemala',
    subregion: 'central',
    values: [
      14259687, 14521515, 14781942, 15043981, 15306316, 15567419, 15827690,
      16087418, 16346950, 16604026,
    ],
  },
  {
    code: 'BOL',
    iso2: 'bo',
    name: 'Bolivia',
    subregion: 'south',
    values: [
      10048590, 10212954, 10377676, 10542376, 10706517, 10869730, 11031813,
      11192854, 11353142, 11513100,
    ],
  },
  {
    code: 'CUB',
    iso2: 'cu',
    name: 'Cuba',
    subregion: 'caribbean',
    values: [
      11225832, 11236670, 11257101, 11282720, 11306902, 11324781, 11335109,
      11339259, 11338138, 11333483,
    ],
  },
  {
    code: 'HTI',
    iso2: 'ht',
    name: 'Haiti',
    subregion: 'caribbean',
    values: [
      9949322, 10100320, 10250930, 10400673, 10549008, 10695542, 10839970,
      10982366, 11123176, 11263077,
    ],
  },
  {
    code: 'DOM',
    iso2: 'do',
    name: 'Dominican Republic',
    subregion: 'caribbean',
    values: [
      9695121, 9813210, 9930911, 10048224, 10165178, 10281680, 10397743,
      10513131, 10627165, 10738958,
    ],
  },
  {
    code: 'HND',
    iso2: 'hn',
    name: 'Honduras',
    subregion: 'central',
    values: [
      8317470, 8480671, 8640691, 8798521, 8955589, 9112916, 9270795, 9429013,
      9587522, 9746117,
    ],
  },
  {
    code: 'PRY',
    iso2: 'py',
    name: 'Paraguay',
    subregion: 'south',
    values: [
      6248020, 6333976, 6421512, 6510276, 6599526, 6688746, 6777872, 6867062,
      6956071, 7044636,
    ],
  },
  {
    code: 'NIC',
    iso2: 'ni',
    name: 'Nicaragua',
    subregion: 'central',
    values: [
      5824065, 5903039, 5982526, 6062454, 6142733, 6223240, 6303974, 6384855,
      6465513, 6545502,
    ],
  },
  {
    code: 'SLV',
    iso2: 'sv',
    name: 'El Salvador',
    subregion: 'central',
    values: [
      6183875, 6210568, 6237923, 6266070, 6295128, 6325124, 6356143, 6388122,
      6420744, 6453553,
    ],
  },
  {
    code: 'CRI',
    iso2: 'cr',
    name: 'Costa Rica',
    subregion: 'central',
    values: [
      4577378, 4633086, 4688000, 4742107, 4795396, 4847804, 4899345, 4949954,
      4999441, 5047561,
    ],
  },
  {
    code: 'PAN',
    iso2: 'pa',
    name: 'Panama',
    subregion: 'central',
    values: [
      3642687, 3706483, 3770624, 3835437, 3901315, 3968487, 4037078, 4106771,
      4176873, 4246439,
    ],
  },
  {
    code: 'URY',
    iso2: 'uy',
    name: 'Uruguay',
    subregion: 'south',
    values: [
      3359275, 3368934, 3378974, 3389439, 3400434, 3412009, 3424132, 3436646,
      3449299, 3461734,
    ],
  },
  {
    code: 'PRI',
    iso2: 'pr',
    name: 'Puerto Rico',
    subregion: 'caribbean',
    values: [
      3721525, 3678732, 3634488, 3593077, 3534874, 3473232, 3406672, 3325286,
      3193354, 3193694,
    ],
  },
  {
    code: 'JAM',
    iso2: 'jm',
    name: 'Jamaica',
    subregion: 'caribbean',
    values: [
      2810460, 2825929, 2842132, 2858709, 2875136, 2891021, 2906238, 2920853,
      2934855, 2948279,
    ],
  },
  {
    code: 'TTO',
    iso2: 'tt',
    name: 'Trinidad and Tobago',
    subregion: 'caribbean',
    values: [
      1328147, 1336178, 1344817, 1353700, 1362342, 1370328, 1377564, 1384072,
      1389858, 1394973,
    ],
  },
  {
    code: 'GUY',
    iso2: 'gy',
    name: 'Guyana',
    subregion: 'south',
    values: [
      749436, 752028, 755399, 759285, 763380, 767432, 771366, 775221, 779004,
      782766,
    ],
  },
  {
    code: 'SUR',
    iso2: 'sr',
    name: 'Suriname',
    subregion: 'south',
    values: [
      529131, 535179, 541245, 547291, 553273, 559143, 564888, 570496, 575991,
      581372,
    ],
  },
  {
    code: 'BLZ',
    iso2: 'bz',
    name: 'Belize',
    subregion: 'central',
    values: [
      322464, 330237, 338000, 345715, 353366, 360933, 368400, 375769, 383071,
      390353,
    ],
  },
  {
    code: 'BHS',
    iso2: 'bs',
    name: 'Bahamas',
    subregion: 'caribbean',
    values: [
      354942, 359577, 363584, 367168, 370633, 374206, 377931, 381761, 385640,
      389482,
    ],
  },
  {
    code: 'BRB',
    iso2: 'bb',
    name: 'Barbados',
    subregion: 'caribbean',
    values: [
      282131, 282987, 283700, 284296, 284825, 285324, 285796, 286233, 286641,
      287025,
    ],
  },
  {
    code: 'LCA',
    iso2: 'lc',
    name: 'St. Lucia',
    subregion: 'caribbean',
    values: [
      174085, 175544, 176646, 177513, 178296, 179126, 180024, 180955, 181889,
      182790,
    ],
  },
  {
    code: 'CUW',
    iso2: 'cw',
    name: 'Curacao',
    subregion: 'caribbean',
    values: [
      148703, 150831, 152088, 153822, 155909, 157980, 159664, 160175, 159800,
      157538,
    ],
  },
  {
    code: 'GRD',
    iso2: 'gd',
    name: 'Grenada',
    subregion: 'caribbean',
    values: [
      106233, 106796, 107446, 108170, 108902, 109599, 110261, 110874, 111454,
      112003,
    ],
  },
  {
    code: 'VCT',
    iso2: 'vc',
    name: 'St. Vincent and the Grenadines',
    subregion: 'caribbean',
    values: [
      108255, 108316, 108435, 108622, 108861, 109148, 109459, 109827, 110210,
      110589,
    ],
  },
  {
    code: 'VIR',
    iso2: 'vi',
    name: 'U.S. Virgin Islands',
    subregion: 'caribbean',
    values: [
      108358, 108292, 108191, 108044, 107884, 107710, 107510, 107268, 106977,
      106631,
    ],
  },
  {
    code: 'ABW',
    iso2: 'aw',
    name: 'Aruba',
    subregion: 'caribbean',
    values: [
      101669, 102046, 102560, 103159, 103774, 104341, 104872, 105366, 105845,
      106314,
    ],
  },
  {
    code: 'ATG',
    iso2: 'ag',
    name: 'Antigua and Barbuda',
    subregion: 'caribbean',
    values: [
      88028, 89253, 90409, 91516, 92562, 93566, 94527, 95426, 96286, 97118,
    ],
  },
  {
    code: 'DMA',
    iso2: 'dm',
    name: 'Dominica',
    subregion: 'caribbean',
    values: [
      70878, 70916, 70965, 71016, 71085, 71183, 71307, 71458, 71625, 71808,
    ],
  },
  {
    code: 'CYM',
    iso2: 'ky',
    name: 'Cayman Islands',
    subregion: 'caribbean',
    values: [
      56672, 57878, 58958, 59932, 60848, 61724, 62569, 63382, 64174, 64948,
    ],
  },
  {
    code: 'KNA',
    iso2: 'kn',
    name: 'St. Kitts and Nevis',
    subregion: 'caribbean',
    values: [
      49016, 49447, 49887, 50331, 50774, 51203, 51625, 52045, 52441, 52823,
    ],
  },
  {
    code: 'SXM',
    iso2: 'sx',
    name: 'Sint Maarten',
    subregion: 'caribbean',
    values: [
      34056, 33435, 34640, 36607, 37685, 38825, 39969, 40574, 40654, 40733,
    ],
  },
  {
    code: 'TCA',
    iso2: 'tc',
    name: 'Turks and Caicos Islands',
    subregion: 'caribbean',
    values: [
      32660, 33377, 34066, 34731, 35369, 35981, 36559, 37115, 37665, 38191,
    ],
  },
  {
    code: 'MAF',
    iso2: 'mf',
    name: 'Saint Martin',
    subregion: 'caribbean',
    values: [
      37582, 37446, 37009, 36453, 36015, 35858, 36065, 36560, 37264, 38002,
    ],
  },
  {
    code: 'VGB',
    iso2: 'vg',
    name: 'British Virgin Islands',
    subregion: 'caribbean',
    values: [
      27794, 28319, 28650, 28847, 28989, 29152, 29355, 29577, 29802, 30030,
    ],
  },
]
