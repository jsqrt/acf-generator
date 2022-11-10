

export const removeAllRoots = ($sectionNode) => {
  const rootSelectors = [
    '._root',
    '._content',
    '._vars',
  ];

  rootSelectors.forEach((selector) => {
    const $allRoots = Array.from($sectionNode.querySelectorAll(selector)).reverse();

    if ($allRoots.length) { // срабатывает раньше того, как цикл добежит до последнего чилда
      $allRoots.forEach(($root) => {
        const rootInner = $root.innerHTML;
        $root.insertAdjacentHTML('beforebegin', rootInner);
        $root.remove();
      });
    }
  })
};