export const SITE_NAME = 'Ahya Workspace'

export type PageSeo = {
  title: string
  description: string
}

export function resolvePageSeo(pathname: string): PageSeo {
  if (pathname.startsWith('/products')) {
    return {
      title: `Shop | ${SITE_NAME}`,
      description:
        'Search and browse products with category filters, debounced search, and pagination against a live catalog API.',
    }
  }
  if (pathname.startsWith('/onboarding')) {
    return {
      title: `Profile | ${SITE_NAME}`,
      description:
        'Multi-step profile setup with validation: personal details, preferences, and a final review before completion.',
    }
  }
  if (pathname.startsWith('/library')) {
    return {
      title: `Library | ${SITE_NAME}`,
      description:
        'Design system gallery: buttons, inputs, modal, tooltip, and toast patterns built with CSS Modules.',
    }
  }
  if (pathname.startsWith('/settings')) {
    return {
      title: `Settings | ${SITE_NAME}`,
      description:
        'Application settings and preferences for your workspace.',
    }
  }
  return {
    title: `Dashboard | ${SITE_NAME}`,
    description:
      'Executive overview: revenue KPIs, growth chart, recent activity, and actionable insights for your team.',
  }
}
