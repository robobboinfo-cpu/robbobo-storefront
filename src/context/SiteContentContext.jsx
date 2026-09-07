import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { defaultSiteContent, normalizeSiteContent } from '../lib/defaultSiteContent'
import { supabase } from '../lib/supabase'

const SiteContentContext = createContext({
  siteContent: defaultSiteContent,
  loading: true,
})

export const SiteContentProvider = ({ children }) => {
  const [siteContent, setSiteContent] = useState(defaultSiteContent)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('value')
        .eq('key', 'public_site_content')
        .maybeSingle()

      if (!error && data?.value) {
        setSiteContent(normalizeSiteContent(data.value))
      } else {
        setSiteContent(defaultSiteContent)
      }

      setLoading(false)
    }

    load()
  }, [])

  const value = useMemo(() => ({ siteContent, loading }), [siteContent, loading])
  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>
}

export const useSiteContent = () => useContext(SiteContentContext)
