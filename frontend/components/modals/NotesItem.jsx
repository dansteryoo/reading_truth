import React from "react";

const styles = {
    container: "note-button-container",
    front: "note-front",
    bottom: "note-bottom",
    title: "note-title",
    body: "note-body",
    time: "note-time",
    back: "note-back",
    delete: "note-delete",
    update: "note-update",
    cancel: "note-cancel",
    deleteBody: "note-delete-body",
};

/******************************
 *    NotesItem Component     *
 ******************************/

const NotesItem = ({
    eachNote,
    handleUpdate,
    handleDelete,
    toggleClass,
    noteId,
}) => {
    const formateDate = (date) => {
        const fullDate = new Date(date).toString();
        const day = fullDate.slice(0, 3);
        const month = fullDate.slice(4, 7);
        const num = fullDate.slice(8, 10);
        const year = fullDate.slice(11, 15);
        return `${day} - ${month} ${num}, ${year}`;
    };

    const renderFlipCard = () => {
        if (noteId !== eachNote.id) return "note-li";
        return "note-flip";
    };

    return (
        <li className={renderFlipCard()}>
            {/******************************
             *         Front Side          *
             ******************************/}

            <div className={styles.front}>
                <div className={styles.bottom}>
                    <span> Book: </span>
                    {eachNote.category}
                </div>
                <div className={styles.title}>
                    <span>Day {eachNote.day}: </span>
                    {eachNote.title}
                </div>
                <div className={styles.body}>
                    <span>Preview: </span>
                    {eachNote.body}
                </div>
                <div className={styles.time}>
                    <span>Created: </span>
                    {formateDate(eachNote.created_at)}
                    <br />
                    <span>Updated: </span>
                    {formateDate(eachNote.updated_at)}
                </div>

                <div className={styles.container}>
                    <button
                        className={styles.update}
                        onClick={() => handleUpdate(eachNote.id)}
                    >
                        Update
                    </button>
                    <button
                        className={styles.delete}
                        onClick={() => toggleClass(eachNote.id)}
                    >
                        Delete
                    </button>
                </div>
            </div>

            {/******************************
             *          Back Side          *
             ******************************/}

            <div className={styles.back}>
                <div className={styles.container}>
                    <button
                        className={styles.delete}
                        onClick={() => handleDelete(eachNote.id)}
                    >
                        Delete
                    </button>
                    <button className={styles.cancel} onClick={toggleClass}>
                        Cancel
                    </button>
                </div>
                <br />
                <br />
                <div className={styles.deleteBody}>
                    <p>Delete Note?</p>
                </div>
            </div>
        </li>
    );
};

export default NotesItem;
