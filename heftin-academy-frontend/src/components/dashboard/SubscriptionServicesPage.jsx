const PLANS = [
  { name: 'Free', audience: 'New individual learners', access: 'UPSC exams + core learning', status: 'Live' },
  { name: 'Scholar', audience: 'Serious individual learners', access: 'Microtasks + knowledge base', status: 'Live' },
  { name: 'Pro', audience: 'Advanced individual learners', access: 'Analytics + deeper practice', status: 'Live' },
  { name: 'Institution', audience: 'Organizations and batches', access: 'B2B operations + rights pack', status: 'Live' },
]

export default function SubscriptionServicesPage() {
  return (
    <section className="subscription-services-page">
      <div className="subscription-services-heading">
        <div><span className="dash-section-label">Platform controls</span><h2>Subscriptions and rights</h2><p>Define plan access separately from organization operations. Heftin controls the catalog; Org Admins use the rights they receive.</p></div>
        <button type="button">New plan</button>
      </div>
      <div className="subscription-plan-grid">{PLANS.map((plan) => <article key={plan.name} className="subscription-plan"><div className="subscription-plan-top"><div><strong>{plan.name}</strong><span>{plan.audience}</span></div><b>{plan.status}</b></div><p>{plan.access}</p><button type="button">Edit plan</button></article>)}</div>
      <article className="subscription-rights"><span className="dash-section-label">Rights distribution</span><h3>Pack rules</h3><div className="subscription-rights-grid"><div><strong>Heftin Super Admin</strong><span>Defines plans, organization packs, and platform-only rights.</span></div><div><strong>Organization Admin</strong><span>Assigns only rights included in the organization pack.</span></div><div><strong>Faculty and Student</strong><span>Receive access from the organization and assigned role.</span></div></div></article>
    </section>
  )
}
