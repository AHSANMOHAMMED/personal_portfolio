'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import styles from './SystemArchitectureSection.module.css'

const NODES = [
  { id: 'client', title: 'CLIENT LAYER', sub: 'React / Next.js / Flutter', desc: 'Stateful UI, PWA & Mobile clients' },
  { id: 'gateway', title: 'API GATEWAY', sub: 'Nginx / Reverse Proxy', desc: 'Rate limiting, SSL termination, JWT routing' },
  { id: 'backend', title: 'MICROSERVICES', sub: 'Node.js / Express / Java', desc: 'Business logic & RBAC authorization' },
  { id: 'database', title: 'PRIMARY DB', sub: 'PostgreSQL / MongoDB', desc: 'ACID transactions, indexed schemas' },
  { id: 'cache', title: 'CACHE & QUEUE', sub: 'Redis / WebSockets', desc: 'Pub/Sub & real-time socket events' },
  { id: 'infra', title: 'INFRA & CLOUD', sub: 'Docker / Cloud VPS', desc: 'Container orchestration & CI/CD' },
]

export default function SystemArchitectureSection() {
  const sectionRef = useRef(null)
  const [activeNode, setActiveNode] = useState(NODES[0])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const cards = section.querySelectorAll('.' + styles.nodeCard)
    gsap.set(cards, { opacity: 0, scale: 0.9, y: 20 })

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        gsap.to(cards, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'back.out(1.2)',
        })
        observer.disconnect()
      }
    }, { threshold: 0.2 })

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className={styles.section} id="architecture">
      <div className={styles.container}>
        
        <div className={styles.header}>
          <span className={styles.kicker}>ENGINEERING DEEP DIVE</span>
          <h2 className={styles.title}>BEHIND THE INTERFACE</h2>
          <p className={styles.subtitle}>
            How I architect scalable, highly available full-stack systems from client to deployment.
          </p>
        </div>

        {/* Dynamic Interactive Topology Grid */}
        <div className={styles.topologyGrid}>
          {NODES.map((node, i) => (
            <div
              key={node.id}
              className={`${styles.nodeCard} ${activeNode.id === node.id ? styles.activeNode : ''}`}
              onClick={() => setActiveNode(node)}
              data-cursor="hover"
            >
              <div className={styles.nodeHeader}>
                <span className={styles.nodeStep}>0{i + 1}</span>
                <span className={styles.nodeDot} />
              </div>
              <h3 className={styles.nodeTitle}>{node.title}</h3>
              <p className={styles.nodeSub}>{node.sub}</p>

              {i < NODES.length - 1 && (
                <div className={styles.connectionLine}>
                  <div className={styles.pulseDot} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Selected Node Inspector Window */}
        <div className={styles.inspectorWindow}>
          <div className={styles.inspectorHeader}>
            <span className={styles.termDot} style={{ background: '#ff5f56' }} />
            <span className={styles.termDot} style={{ background: '#ffbd2e' }} />
            <span className={styles.termDot} style={{ background: '#27c93f' }} />
            <span className={styles.termTitle}>ARCH_INSPECTOR // {activeNode.id.toUpperCase()}</span>
          </div>
          <div className={styles.inspectorBody}>
            <p className={styles.specTitle}>{activeNode.title} — {activeNode.sub}</p>
            <p className={styles.specDesc}>{activeNode.desc}</p>
            <div className={styles.specMetrics}>
              <span className={styles.metricItem}>LATENCY: &lt;15ms</span>
              <span className={styles.metricItem}>AVAILABILITY: 99.9%</span>
              <span className={styles.metricItem}>SECURITY: JWT + TLS 1.3</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

