import { FC, useState, useEffect } from 'react'
import styles from './Bloggers.module.scss'

interface Blogger {
  id: string
  name: string
  username: string
  status: string
  tags: string[]
  number: string
  date: string
}

const STORAGE_KEY = 'bloggers_list'

const loadBloggersFromStorage = (): Blogger[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const bloggers = JSON.parse(stored)
      console.log('Загружено из localStorage:', bloggers.length, 'блогеров')
      return bloggers
    }
  } catch (error) {
    console.error('Ошибка загрузки блогеров из localStorage:', error)
  }
  console.log('localStorage пуст, возвращаем пустой массив')
  return []
}

const saveBloggersToStorage = (bloggers: Blogger[]) => {
  try {
    const data = JSON.stringify(bloggers)
    localStorage.setItem(STORAGE_KEY, data)
    console.log('Сохранено в localStorage:', bloggers.length, 'блогеров')
  } catch (error) {
    console.error('Ошибка сохранения блогеров в localStorage:', error)
  }
}

export const Bloggers: FC = () => {
  const [bloggers, setBloggers] = useState<Blogger[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBlogger, setEditingBlogger] = useState<Blogger | null>(null)
  const [newBlogger, setNewBlogger] = useState({
    name: '',
    username: '',
    status: 'ON',
    tags: [''],
    number: '',
    date: new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }),
  })

  useEffect(() => {
    const loadedBloggers = loadBloggersFromStorage()
    setBloggers(loadedBloggers)
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (isInitialized) {
      saveBloggersToStorage(bloggers)
    }
  }, [bloggers, isInitialized])

  const handleAddBlogger = () => {
    if (!newBlogger.name.trim()) {
      alert('Пожалуйста, введите имя блогера')
      return
    }

    if (!newBlogger.username.trim()) {
      alert('Пожалуйста, введите username блогера')
      return
    }

    const blogger: Blogger = {
      id: `blogger_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: newBlogger.name,
      username: newBlogger.username,
      status: newBlogger.status,
      tags: newBlogger.tags.filter(tag => tag.trim() !== ''),
      number: newBlogger.number || `№${Date.now()}`,
      date: newBlogger.date,
    }

    const updatedBloggers = [...bloggers, blogger]
    setBloggers(updatedBloggers)
    saveBloggersToStorage(updatedBloggers)
    setIsModalOpen(false)
    setNewBlogger({
      name: '',
      username: '',
      status: 'ON',
      tags: [''],
      number: '',
      date: new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    })
  }

  const handleEditBlogger = (blogger: Blogger) => {
    setEditingBlogger(blogger)
    setNewBlogger({
      name: blogger.name,
      username: blogger.username,
      status: blogger.status,
      tags: blogger.tags.length > 0 ? blogger.tags : [''],
      number: blogger.number,
      date: blogger.date,
    })
    setIsModalOpen(true)
  }

  const handleSaveEdit = () => {
    if (!newBlogger.name.trim()) {
      alert('Пожалуйста, введите имя блогера')
      return
    }

    if (!newBlogger.username.trim()) {
      alert('Пожалуйста, введите username блогера')
      return
    }

    if (!editingBlogger) return

    const updatedBlogger: Blogger = {
      ...editingBlogger,
      name: newBlogger.name,
      username: newBlogger.username,
      status: newBlogger.status,
      tags: newBlogger.tags.filter(tag => tag.trim() !== ''),
      number: newBlogger.number,
      date: newBlogger.date,
    }

    const updatedBloggers = bloggers.map(b => b.id === editingBlogger.id ? updatedBlogger : b)
    setBloggers(updatedBloggers)
    saveBloggersToStorage(updatedBloggers)
    setIsModalOpen(false)
    setEditingBlogger(null)
    setNewBlogger({
      name: '',
      username: '',
      status: 'ON',
      tags: [''],
      number: '',
      date: new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    })
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingBlogger(null)
    setNewBlogger({
      name: '',
      username: '',
      status: 'ON',
      tags: [''],
      number: '',
      date: new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    })
  }

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...newBlogger.tags]
    newTags[index] = value
    setNewBlogger({ ...newBlogger, tags: newTags })
  }

  const addTagField = () => {
    setNewBlogger({ ...newBlogger, tags: [...newBlogger.tags, ''] })
  }

  return (
    <div className={styles.bloggers}>
      <div className={styles.header}>
        <h1 className={styles.title}>блогеры</h1>
        <button 
          className={styles.addButton}
          onClick={() => {
            setEditingBlogger(null)
            setNewBlogger({
              name: '',
              username: '',
              status: 'ON',
              tags: [''],
              number: '',
              date: new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }),
            })
            setIsModalOpen(true)
          }}
        >
          <span className={styles.buttonText}>+ Добавить</span>
        </button>
      </div>
      
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{editingBlogger ? 'Редактировать блогера' : 'Добавить нового блогера'}</h2>
              <button 
                className={styles.modalClose}
                onClick={handleCloseModal}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Имя блогера *</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={newBlogger.name}
                  onChange={(e) => setNewBlogger({ ...newBlogger, name: e.target.value })}
                  placeholder="Введите имя блогера"
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Username *</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={newBlogger.username}
                  onChange={(e) => setNewBlogger({ ...newBlogger, username: e.target.value })}
                  placeholder="Введите username"
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Статус</label>
                <select
                  className={styles.formSelect}
                  value={newBlogger.status}
                  onChange={(e) => setNewBlogger({ ...newBlogger, status: e.target.value })}
                >
                  <option value="ON">ON</option>
                  <option value="OFF">OFF</option>
                </select>
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Теги</label>
                {newBlogger.tags.map((tag, index) => (
                  <input
                    key={index}
                    type="text"
                    className={styles.formInput}
                    value={tag}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                    placeholder={`Тег ${index + 1}`}
                    style={{ marginBottom: '8px' }}
                  />
                ))}
                <button 
                  type="button"
                  className={styles.addTagButton}
                  onClick={addTagField}
                >
                  + Добавить тег
                </button>
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Номер</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={newBlogger.number}
                  onChange={(e) => setNewBlogger({ ...newBlogger, number: e.target.value })}
                  placeholder="№1234567890"
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button 
                className={styles.modalCancelButton}
                onClick={handleCloseModal}
              >
                Отмена
              </button>
              <button 
                className={styles.modalSaveButton}
                onClick={editingBlogger ? handleSaveEdit : handleAddBlogger}
              >
                {editingBlogger ? 'Сохранить' : 'Добавить'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className={styles.bloggersGrid}>
        {bloggers.map((blogger) => (
          <div key={blogger.id} className={styles.influencerCard}>
            <div className={styles.influencerHeader}>
              <div className={styles.influencerAvatar}></div>
              <div className={styles.influencerInfo}>
                <div className={styles.influencerTitleRow}>
                  <div className={styles.influencerTitleWrapper}>
                    <span className={styles.influencerName}>{blogger.name}</span>
                    <div className={styles.statusChip}>
                      <span className={styles.statusText}>{blogger.status}</span>
                    </div>
                  </div>
                  <div 
                    className={styles.editIcon}
                    onClick={() => handleEditBlogger(blogger)}
                    title="Редактировать"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ position: 'absolute', left: '0px', top: '0px' }}>
                      <rect x="1" y="1" width="10" height="10" stroke="currentColor" strokeWidth="1"/>
                    </svg>
                  </div>
                </div>
                <p className={styles.influencerUsername}>{blogger.username}</p>
              </div>
            </div>
            
            <div className={styles.influencerTags}>
              {blogger.tags.map((tag, index) => (
                <div key={index} className={styles.tag}>
                  <span className={styles.tagText}>{tag}</span>
                </div>
              ))}
            </div>
            
            <div className={styles.influencerMeta}>
              <span className={styles.influencerNumber}>{blogger.number}</span>
              <span className={styles.influencerDate}>{blogger.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
