import SmartLink from '@/components/SmartLink'

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

const CategoryGroup = ({ currentCategory, categories }) => {
  if (!categories || categories.length === 0) {
    return <></>
  }

  const groups = {}
  categories.forEach(category => {
    const { parent, child } = splitCategoryName(category.name)
    if (!parent) return
    if (!groups[parent]) {
      groups[parent] = []
    }
    groups[parent].push({ ...category, parent, child })
  })

  return (
    <>
      <div id='category-list' className='dark:border-gray-600 flex flex-wrap mx-4'>
        {Object.entries(groups).map(([parent, children]) => {
          const parentOnly = children.find(c => !c.child)
          const childItems = children.filter(c => c.child)
          return (
            <div key={parent} className='w-full mb-2'>
              <div className='text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1'>
                {parent}
              </div>

              {parentOnly && !childItems.length && (
                <SmartLink
                  key={parentOnly.name}
                  href={`/category/${parentOnly.name}`}
                  passHref
                  className={
                    (currentCategory === parentOnly.name
                      ? 'hover:text-white dark:hover:text-white bg-indigo-600 text-white '
                      : 'dark:text-gray-400 text-gray-500 hover:text-white dark:hover:text-white hover:bg-indigo-600') +
                    ' text-sm w-full items-center duration-300 px-2 cursor-pointer py-1 font-light'
                  }>
                  <div>
                    <i
                      className={`mr-2 fas ${
                        currentCategory === parentOnly.name ? 'fa-folder-open' : 'fa-folder'
                      }`}
                    />
                    {parentOnly.name}({parentOnly.count})
                  </div>
                </SmartLink>
              )}

              {childItems.length > 0 && (
                <div className='ml-4'>
                  {childItems.map(childCat => {
                    const selected = currentCategory === childCat.name
                    return (
                      <SmartLink
                        key={childCat.name}
                        href={`/category/${childCat.name}`}
                        passHref
                        className={
                          (selected
                            ? 'hover:text-white dark:hover:text-white bg-indigo-600 text-white '
                            : 'dark:text-gray-400 text-gray-500 hover:text-white dark:hover:text-white hover:bg-indigo-600') +
                          ' text-sm w-full items-center duration-300 px-2 cursor-pointer py-1 font-light'
                        }>
                        <div>
                          <i
                            className={`mr-2 fas ${
                              selected ? 'fa-folder-open' : 'fa-folder'
                            }`}
                          />
                          {childCat.child}({childCat.count})
                        </div>
                      </SmartLink>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

export default CategoryGroup
