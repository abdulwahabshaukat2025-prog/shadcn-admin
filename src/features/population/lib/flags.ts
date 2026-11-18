// Flag SVGs from the MIT-licensed flag-icons package; only the 42 we need are bundled.
const files = import.meta.glob(
  '/node_modules/flag-icons/flags/4x3/{br,mx,co,ar,pe,ve,cl,ec,gt,bo,cu,ht,do,hn,py,ni,sv,cr,pa,uy,pr,jm,tt,gy,sr,bz,bs,bb,lc,cw,gd,vc,vi,aw,ag,dm,ky,kn,sx,tc,mf,vg}.svg',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>

const byIso2: Record<string, string> = {}
for (const [path, url] of Object.entries(files)) {
  byIso2[path.split('/').pop()!.replace('.svg', '')] = url
}

export const flagUrl = (iso2: string) => byIso2[iso2]
