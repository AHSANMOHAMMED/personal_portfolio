'use client'

import { useEffect, useState } from 'react'
import { FaGithub, FaStar, FaCodeBranch } from 'react-icons/fa'
import profile from '@/data/profile.json'
import styles from './GitHubSection.module.css'

export default function GitHubSection() {
  const [userData, setUserData] = useState(null)
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function fetchGitHubData() {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch('https://api.github.com/users/AHSANMOHAMMED'),
          fetch('https://api.github.com/users/AHSANMOHAMMED/repos?sort=updated&per_page=6')
        ])

        if (userRes.ok && reposRes.ok) {
          const userJson = await userRes.json()
          const reposJson = await reposRes.json()
          if (isMounted) {
            setUserData(userJson)
            setRepos(reposJson)
          }
        }
      } catch (err) {
        console.warn('GitHub API rate limit or network issue, using fallback profile data.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchGitHubData()
    return () => { isMounted = false }
  }, [])

  return (
    <section className={styles.section} id="github">
      <div className={styles.container}>
        
        <div className={styles.header}>
          <span className={styles.kicker}>OPEN SOURCE & CODE</span>
          <h2 className={styles.title}>BUILT IN PUBLIC</h2>
          <p className={styles.subtitle}>
            Explore my GitHub profile, recent repositories, and continuous code activity.
          </p>
        </div>

        {/* Profile Card */}
        <div className={styles.profileCard}>
          <div className={styles.profileMeta}>
            <FaGithub size={40} className={styles.ghIcon} />
            <div>
              <h3 className={styles.username}>@AHSANMOHAMMED</h3>
              <p className={styles.userBio}>Full-Stack Software Engineer • Sri Lanka</p>
            </div>
          </div>

          <div className={styles.statsRow}>
            <div className={styles.statBox}>
              <span className={styles.statVal}>{userData?.public_repos || '15+'}</span>
              <span className={styles.statLbl}>Public Repos</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statVal}>{userData?.followers || '10+'}</span>
              <span className={styles.statLbl}>Followers</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statVal}>4</span>
              <span className={styles.statLbl}>Production Apps</span>
            </div>
          </div>

          <a
            href="https://github.com/AHSANMOHAMMED"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ghBtn}
            data-cursor="hover"
          >
            Visit GitHub Profile
          </a>
        </div>

        {/* Selected Repositories Grid */}
        <div className={styles.reposGrid}>
          {repos.length > 0
            ? repos.map((repo) => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.repoCard}
                  data-cursor="hover"
                >
                  <div className={styles.repoTop}>
                    <h4 className={styles.repoName}>{repo.name}</h4>
                    {repo.language && <span className={styles.repoLang}>{repo.language}</span>}
                  </div>
                  <p className={styles.repoDesc}>{repo.description || 'No description provided.'}</p>
                  <div className={styles.repoMeta}>
                    <span><FaStar size={12} /> {repo.stargazers_count}</span>
                    <span><FaCodeBranch size={12} /> {repo.forks_count}</span>
                  </div>
                </a>
              ))
            : profile.projects.slice(0, 4).map((p) => (
                <a
                  key={p.id}
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.repoCard}
                  data-cursor="hover"
                >
                  <div className={styles.repoTop}>
                    <h4 className={styles.repoName}>{p.title}</h4>
                    <span className={styles.repoLang}>{p.tech[0]}</span>
                  </div>
                  <p className={styles.repoDesc}>{p.desc}</p>
                  <div className={styles.repoMeta}>
                    <span><FaStar size={12} /> Featured</span>
                  </div>
                </a>
              ))}
        </div>

      </div>
    </section>
  )
}

