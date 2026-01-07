import { FC } from 'react'
import classNames from 'classnames'
import styles from './Icon.module.scss'

// Импортируйте SVG иконки после экспорта из Figma
// Пример:
// import LogoIcon from '@/shared/assets/icons/logo.svg?react'
// import MenuIcon from '@/shared/assets/icons/menu.svg?react'

// Типы иконок - добавьте свои из Figma
export type IconType = 
  | 'logo'
  | 'menu'
  | 'close'
  | 'search'
  | 'user'
  | 'settings'
  | 'arrow-right'
  | 'arrow-left'

interface IconProps {
  name: IconType
  className?: string
  size?: number | string
  color?: string
}

// Компонент для работы с SVG иконками из Figma
// После экспорта SVG из Figma, импортируйте их и добавьте в iconComponents
export const Icon: FC<IconProps> = ({ 
  name, 
  className, 
  size = 24,
  color 
}) => {
  // После экспорта иконок из Figma, добавьте их сюда:
  // import LogoIcon from '@/shared/assets/icons/logo.svg?react'
  // const iconComponents: Record<IconType, React.ComponentType<any>> = {
  //   logo: LogoIcon,
  //   menu: MenuIcon,
  //   ...
  // }
  
  // Временная заглушка - замените на реальные импорты
  const iconComponents: Record<IconType, React.ComponentType<any> | null> = {
    logo: null,
    menu: null,
    close: null,
    search: null,
    user: null,
    settings: null,
    'arrow-right': null,
    'arrow-left': null,
  }

  const IconComponent = iconComponents[name]

  if (!IconComponent) {
    // Fallback: используем img если компонент не найден
    return (
      <img
        src={`/icons/${name}.svg`}
        alt={name}
        className={classNames(styles.icon, className)}
        style={{
          width: size,
          height: size,
        }}
      />
    )
  }

  return (
    <IconComponent
      className={classNames(styles.icon, className)}
      style={{
        width: size,
        height: size,
        ...(color && { color, fill: color }),
      }}
    />
  )
}

