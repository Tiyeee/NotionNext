import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useEffect, useRef } from 'react'
import Card from './Card'
import SearchInput from './SearchInput'
import TagItemMini from './TagItemMini'

const splitCategoryName = name => {
  if (!name) return { parent: '', child: '' }
  const parts = String(name).split('>')
  if (parts.length === 1) {
    const parent = parts[0].trim()
    return { parent, child: '' }
  }
  const parent = parts[0].trim()
  const child = parts.slice(1).join('>').trim()
  return { parent, child }
}

/**
 * 搜索页面的导航
 * @param {*} props
 * @returns
 */
export default function SearchNav(props) {
  const { tagOptions, categoryOptions } = props
  const cRef = useRef(null)
  const { locale } = useGlobal()
  useEffect(() => {
    // 自动聚焦到搜索框
    cRef?.current?.focus()
  }, [])

  const groups = {}
  categoryOptions?.forEach(category => {
    const { parent, child } = splitCategoryName(category.name)
    if (!parent) return
    if (!groups[parent]) {
      groups[parent] = []
    }
    groups[parent].push({ ...category, parent, child })
  })

  return (
    <>
      <div className='my-6 px-2'>
        <SearchInput cRef={cRef} {...props} />
        {/* 分类 */}
        <Card className='w-full mt-4'>
          <div className='dark:text-gray-200 mb-5 mx-3'>
            <i className='mr-4 fas fa-th' />
            {locale.COMMON.CATEGORY}:
          </div>
          <div id='category-list' className='duration-200 flex flex-wrap mx-8'>
            {Object.entries(groups).map(([parent, children]) => {
              const childItems = children.filter(c => c.child)
              const parentOnly = children.find(c => !c.child)
              return (
                <div key={parent} className='w-full mb-2'>
                  <div className='text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1'>
                    {parent}
                  </div>
                  {/* 只有父级，没有子级时，作为一个普通分类项 */}
                  {parentOnly && !childItems.length && (
                    <SmartLink
                      key={parentOnly.name}
                      href={`/category/${parentOnly.name}`}
                      passHref
                      legacyBehavior>
                      <div className='duration-300 dark:hover:text-white rounded-lg px-5 cursor-pointer py-2 hover:bg-indigo-400 hover:text-white'>
                        <i className='mr-4 fas fa-folder' />
                        {parentOnly.name}({parentOnly.count})
                      </div>
                    </SmartLink>
                  )}
                  {/* 有子级时，只展示子级列表 */}
                  {childItems.length > 0 && (
                    <div className='flex flex-wrap'>
                      {childItems.map(childCat => (
                        <SmartLink
                          key={childCat.name}
                          href={`/category/${childCat.name}`}
                          passHref
                          legacyBehavior>
                          <div className='mr-3 mb-2 duration-300 dark:hover:text-white rounded-lg px-5 cursor-pointer py-2 hover:bg-indigo-400 hover:text-white text-sm'>
                            <i className='mr-2 fas fa-folder' />
                            {childCat.child}({childCat.count})
                          </div>
                        </SmartLink>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
        {/* 标签 */}
        <Card className='w-full mt-4'>
          <div className='dark:text-gray-200 mb-5 ml-4'>
            <i className='mr-4 fas fa-tag' />
            {locale.COMMON.TAGS}:
          </div>
          <div id='tags-list' className='duration-200 flex flex-wrap ml-8'>
            {tagOptions?.map(tag => {
              return (
                <div key={tag.name} className='p-2'>
                  <TagItemMini key={tag.name} tag={tag} />
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </>
  )
}
