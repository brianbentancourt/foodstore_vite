export const generateSmartComposition = prod => {
    const { qty = 0 } = prod
    let smartComposition = []

    if (prod.smartComposition) {
        smartComposition = [...prod.smartComposition]
        // a continuacion se agrega control para cuando se edita la cantidad de productos
        if (prod.smartComposition.length < qty) {
            //const news = qty - prod.smartComposition.length
            //console.log('se agregaron ' + news + ' productos')
            let i = prod.smartComposition.length + 1
            for (i; i <= qty; i++) {
                //console.log('se agrega cod ' + i)
                const _item = {
                    ...prod,
                    qty: 1,
                    _cod: i
                }
                smartComposition.push(_item)
            }
        } else if (prod.smartComposition.length > qty) {
            //const deleted = prod.smartComposition.length - qty
            //console.log('se quitaron ' + deleted + ' productos')
            smartComposition = []
            prod.smartComposition.map((p, i) => {
                const count = i + 1
                if (count <= qty) {
                    smartComposition.push({
                        ...p,
                        _cod: count
                    })
                }
                return p
            })
        }
    } else {
        for (let i = 1; i <= qty; i++) {
            const _item = {
                ...prod,
                qty: 1,
                _cod: i
            }
            smartComposition.push(_item)
        }
    }
    return {
        ...prod,
        smartComposition
    }
}