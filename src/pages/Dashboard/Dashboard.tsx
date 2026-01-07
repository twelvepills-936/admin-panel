import { FC, useState, useEffect } from 'react'
import styles from './Dashboard.module.scss'

interface Brand {
  id: string
  name: string
  description: string
  status: string
  tags: string[]
  number: string
  date: string
}

const STORAGE_KEY = 'dashboard_brands'

const loadBrandsFromStorage = (): Brand[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const brands = JSON.parse(stored)
      console.log('Загружено из localStorage:', brands.length, 'брендов')
      return brands
    }
  } catch (error) {
    console.error('Ошибка загрузки брендов из localStorage:', error)
  }
  console.log('localStorage пуст, возвращаем пустой массив')
  return []
}

const saveBrandsToStorage = (brands: Brand[]) => {
  try {
    const data = JSON.stringify(brands)
    localStorage.setItem(STORAGE_KEY, data)
    console.log('Сохранено в localStorage:', brands.length, 'брендов')
  } catch (error) {
    console.error('Ошибка сохранения брендов в localStorage:', error)
  }
}

export const Dashboard: FC = () => {
  const [brands, setBrands] = useState<Brand[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [newBrand, setNewBrand] = useState({
    name: '',
    description: '',
    status: 'ON',
    tags: [''],
    number: '',
    date: new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }),
  })

  useEffect(() => {
    const loadedBrands = loadBrandsFromStorage()
    setBrands(loadedBrands)
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (isInitialized && brands.length >= 0) {
      saveBrandsToStorage(brands)
    }
  }, [brands, isInitialized])

  const handleAddBrand = () => {
    if (!newBrand.name.trim()) {
      alert('Пожалуйста, введите название бренда')
      return
    }

    const brand: Brand = {
      id: `brand_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: newBrand.name,
      description: newBrand.description || 'Описание бренда',
      status: newBrand.status,
      tags: newBrand.tags.filter(tag => tag.trim() !== ''),
      number: newBrand.number || `№${Date.now()}`,
      date: newBrand.date,
    }

    const updatedBrands = [...brands, brand]
    setBrands(updatedBrands)
    saveBrandsToStorage(updatedBrands)
    setIsModalOpen(false)
    setNewBrand({
      name: '',
      description: '',
      status: 'ON',
      tags: [''],
      number: '',
      date: new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    })
  }

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand)
    setNewBrand({
      name: brand.name,
      description: brand.description,
      status: brand.status,
      tags: brand.tags.length > 0 ? brand.tags : [''],
      number: brand.number,
      date: brand.date,
    })
    setIsModalOpen(true)
  }

  const handleSaveEdit = () => {
    if (!newBrand.name.trim()) {
      alert('Пожалуйста, введите название бренда')
      return
    }

    if (!editingBrand) return

    const updatedBrand: Brand = {
      ...editingBrand,
      name: newBrand.name,
      description: newBrand.description || 'Описание бренда',
      status: newBrand.status,
      tags: newBrand.tags.filter(tag => tag.trim() !== ''),
      number: newBrand.number,
      date: newBrand.date,
    }

    const updatedBrands = brands.map(b => b.id === editingBrand.id ? updatedBrand : b)
    setBrands(updatedBrands)
    saveBrandsToStorage(updatedBrands)
    setIsModalOpen(false)
    setEditingBrand(null)
    setNewBrand({
      name: '',
      description: '',
      status: 'ON',
      tags: [''],
      number: '',
      date: new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    })
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingBrand(null)
    setNewBrand({
      name: '',
      description: '',
      status: 'ON',
      tags: [''],
      number: '',
      date: new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    })
  }

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...newBrand.tags]
    newTags[index] = value
    setNewBrand({ ...newBrand, tags: newTags })
  }

  const addTagField = () => {
    setNewBrand({ ...newBrand, tags: [...newBrand.tags, ''] })
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>бренды</h1>
        <button 
          className={styles.addButton}
          onClick={() => {
            setEditingBrand(null)
            setNewBrand({
              name: '',
              description: '',
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
              <h2 className={styles.modalTitle}>{editingBrand ? 'Редактировать бренд' : 'Добавить новый бренд'}</h2>
              <button 
                className={styles.modalClose}
                onClick={handleCloseModal}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Название бренда *</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={newBrand.name}
                  onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                  placeholder="Введите название бренда"
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Описание</label>
                <textarea
                  className={styles.formTextarea}
                  value={newBrand.description}
                  onChange={(e) => setNewBrand({ ...newBrand, description: e.target.value })}
                  placeholder="Введите описание бренда"
                  rows={3}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Статус</label>
                <select
                  className={styles.formSelect}
                  value={newBrand.status}
                  onChange={(e) => setNewBrand({ ...newBrand, status: e.target.value })}
                >
                  <option value="ON">ON</option>
                  <option value="OFF">OFF</option>
                </select>
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Теги</label>
                {newBrand.tags.map((tag, index) => (
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
                  value={newBrand.number}
                  onChange={(e) => setNewBrand({ ...newBrand, number: e.target.value })}
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
                onClick={editingBrand ? handleSaveEdit : handleAddBrand}
              >
                {editingBrand ? 'Сохранить' : 'Добавить'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className={styles.brandsGrid}>
        {brands.map((brand) => (
          <div key={brand.id} className={styles.brandCard}>
            <div className={styles.brandHeader}>
              <div className={styles.brandAvatar}></div>
              <div className={styles.brandInfo}>
                <div className={styles.brandTitleRow}>
                  <div className={styles.brandTitleWrapper}>
                    <span className={styles.brandName}>{brand.name}</span>
                    <div className={styles.statusChip}>
                      <span className={styles.statusText}>{brand.status}</span>
                    </div>
                  </div>
                  <div 
                    className={styles.editIcon}
                    onClick={() => handleEditBrand(brand)}
                    title="Редактировать"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ position: 'absolute', left: '2px', top: '2px' }}>
                      <rect x="1" y="1" width="10" height="10" stroke="currentColor" strokeWidth="1"/>
                    </svg>
                  </div>
                </div>
                <p className={styles.brandDescription}>{brand.description}</p>
              </div>
            </div>
            
            <div className={styles.brandTags}>
              {brand.tags.map((tag, index) => (
                <div key={index} className={styles.tag}>
                  <span className={styles.tagText}>{tag}</span>
                </div>
              ))}
            </div>
            
            <div className={styles.brandMeta}>
              <span className={styles.brandNumber}>{brand.number}</span>
              <span className={styles.brandDate}>{brand.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

