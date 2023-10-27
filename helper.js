const mapNode = (element, key) => {
    if(element.children.length === 1){
        const node = element.children[0];
        return { [filterKey(node.tagName)]: mapNode(node, key) }
    }else if(element.children.length > 1){
        const nodes = {};
        for (const node of element.children) {
            const value = mapNode(node, key);
            let objectKey = node.getAttribute(key) ?? node.tagName;
            nodes[filterKey(objectKey)] = value;
        }
        return nodes;
    }else{
        const attributes = element.getAttributeNames();
        if(attributes.length){
            const object = { };
            attributes.map(key => {
                object[key.toLowerCase()] = element.getAttribute(key);
            });
            if(element.innerHTML){
                if(object.value){
                    object.innerHTML = element.innerHTML;
                }else{
                    object.value = element.innerHTML;
                }
            }
            return object;
        }else{
            return element.innerHTML;
        }
    }
}

const filterKey = (objectKey) => {
    objectKey = objectKey.split("/");
    objectKey = objectKey[objectKey.length - 1];
    objectKey = objectKey.split("#");
    objectKey = objectKey[objectKey.length - 1];
    objectKey = objectKey.split(":");
    objectKey = objectKey[objectKey.length - 1];
    return objectKey;
}

export default { mapNode }
 
