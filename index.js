class Draggable {
    constructor(elem, droppable) {
        this.elem = elem;
        this.elem.style.zIndex = '1000';
        this.elem.style.position = 'absolute';
        this.droppable = Object.assign({}, droppable, {current: null});
        this.mouseCoordsOnElement = {x: 0, y: 0};
        this.elem.addEventListener('mousedown', this.onMouseDown);
        this.elem.addEventListener('mouseup', this.onMouseUp);
        this.elem.addEventListener('dragstart', this.onDragStart);
    }

    getElemCoords() {
        return this.elem.getBoundingClientRect();
    }

    elemMoveTo(x, y) {
        this.elem.style.left = `${x}px`;
        this.elem.style.top = `${y}px`;
    }

    getElemBelow(x, y) {
        this.elem.hidden = true;
        const elemBelow = document.elementFromPoint(x, y);
        this.elem.hidden = false;

        return elemBelow;
    }

    checkBelowElemIsDroppable(elemBelow) {
        let isDraggable = false;
        const {id, className} = this.droppable.elem;

        if (elemBelow && (id || className)) {
            const closestClassName = id && elemBelow.closest(`#${id}`);
            const closestId = className && elemBelow.closest(`.${className}`);

            if ((closestClassName === closestId) || closestClassName || closestId) {
                isDraggable = true;
            }
        }

        return isDraggable;
    }

    onMouseDown = (e) => {
        const coords = this.getElemCoords();
        this.mouseCoordsOnElement = {
            x: e.clientX - coords.x,
            y: e.clientY - coords.y,
        };
        document.addEventListener('mousemove', this.onMouseMove);
    }

    onMouseUp = () => {
        document.removeEventListener('mousemove', this.onMouseMove);
        this.mouseCoordsOnElement = {x: 0, y: 0};
    }

    onMouseMove = (e) => {
        this.elemMoveTo(
            e.clientX - this.mouseCoordsOnElement.x,
            e.clientY - this.mouseCoordsOnElement.y,
        );

        const elemBelow = this.getElemBelow(e.clientX, e.clientY);
        const droppableBelow = this.checkBelowElemIsDroppable(elemBelow) ? this.droppable.elem : null;

        if (this.droppable.current !== droppableBelow) {
            this.droppable.callback(!!droppableBelow);
            this.droppable.current = droppableBelow;
        }
    }

    onDragStart = (e) => {
        e.preventDefault();
    }
}

const droppable = {
    elem: document.querySelector('#gate'),
    callback(onDroppable) {
        this.elem.style.backgroundColor = onDroppable ? 'red' : '';
    },
};

new Draggable(document.querySelector('#ball'), droppable);
