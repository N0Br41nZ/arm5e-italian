import {
    ArM5eActorSheet
} from "./actor-sheet.js";

import {
    log
} from "../tools.js"
/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class ArM5eMagicCodexSheet extends ArM5eActorSheet {

    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["arm5e", "sheet", "actor"],
            template: "systems/arm5e/templates/actor/actor-magic-codex-sheet.html",
            width: 790,
            height: 800,
            tabs: [{
                navSelector: ".sheet-tabs",
                contentSelector: ".sheet-body",
                initial: "base-effects"
            }]
        });
    }

    /* -------------------------------------------- */

    /** @override */
    getData() {
        // Retrieve the data structure from the base sheet. You can inspect or log
        // the context variable to see the structure, but some key properties for
        // sheets are the actor object, the data object, whether or not it's
        // editable, the items array, and the effects array.
        const context = super.getData();

        // no need to import everything
        context.metadata = {};
        context.metadata.magic = CONFIG.ARM5E.magic;
        log(false, "Codex-sheet getData");
        log(false, context);
        // this._prepareCodexItems(context);

        return context;
    }

    /**
     * Organize and classify Items for Codex sheets.
     *
     * @param {Object} sheetData The actor to prepare.
     *
     * @return {undefined}
     */
    _prepareCodexItems(codexData) {
        //let actorData = sheetData.actor.data;
        log(false, "_prepareCodexItems");

    }



    /* -------------------------------------------- */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) return;

        // Add Inventory Item
        // html.find('.item-create').click(this._onItemCreate.bind(this));

        // // Update Inventory Item
        // html.find('.item-edit').click(ev => {
        //     const li = $(ev.currentTarget).parents(".item");
        //     const itid = li.data("itemId");
        //     const item = this.actor.items.get(itid)
        //     item.sheet.render(true);
        // });

        // Delete Inventory Item
        html.find('.effect-delete').click(this._onDeleteEffect.bind(this));

        // Design spell.
        html.find('.design').click(this._onClickEffect.bind(this));



        // Drag events for macros.
        if (this.actor.isOwner) {
            let handler = ev => this._onDragStart(ev);
            html.find('li.item').each((i, li) => {
                if (li.classList.contains("inventory-header")) return;
                li.setAttribute("draggable", true);
                li.addEventListener("dragstart", handler, false);
            });
        }
    }

    async _onDropItem(event, data) {

    }


    /**
     * Handle clickable base effect.
     * @param {Event} event   The originating click event
     * @private
     */
    async _onDeleteEffect(event) {
        event.preventDefault();
        const question = game.i18n.localize("arm5e.dialog.delete-question");
        const li = $(event.currentTarget).parents(".item");
        let itemId = li.data("itemId");
        await Dialog.confirm({
            title: `${li[0].dataset.name}`,
            content: `<p>${question}</p>`,
            yes: () => this._deleteEffect(itemId, li),
            no: () => null,
            rejectClose: true
        })
    }

    _deleteEffect(itemId, li) {

        itemId = itemId instanceof Array ? itemId : [itemId];
        this.actor.deleteEmbeddedDocuments("Item", itemId, {});
        li.slideUp(200, () => this.render(false));

    };

    /**
     * Handle clickable base effect.
     * @param {Event} event   The originating click event
     * @private
     */
    _onClickEffect(event) {
        event.preventDefault();
        const li = $(event.currentTarget).parents(".item");
        let itemId = li.data("itemId");
        const element = event.currentTarget;
        const dataset = element.dataset;
        const question = game.i18n.localize("arm5e.dialog.design-question");
        new Dialog({
            title: `${dataset.name}`,
            content: `<p>${question}</p>`,
            buttons: {
                yes: {
                    icon: "<i class='fas fa-check'></i>",
                    label: `Yes`,
                    callback: () => this._onDesignEffect(itemId)
                },
                no: {
                    icon: "<i class='fas fa-ban'></i>",
                    label: `Cancel`,
                    callback: null
                },
            }
        }).render(true);
    }

    async _onDesignEffect(id) {
        const item = this.actor.items.get(id)
        const itemdata = item.data;
        const dataset = itemdata.data;
        let newItemData;
        if (itemdata.type == "baseEffect") {
            // Initialize a default name.
            const name = `_New "${itemdata.name}" effect`;
            newItemData = [{
                name: name,
                type: "magicalEffect",
                data: {
                    "baseEffectDescription": itemdata.name,
                    "baseLevel": dataset.baseLevel,
                    "technique": {
                        "value": dataset.technique.value
                    },
                    "form": {
                        "value": dataset.form.value
                    }
                }
            }];

        } else //
        {
            newItemData = [{
                name: itemdata.name,
                type: "spell",
                data: foundry.utils.deepClone(itemdata.data)
            }];
            // Remove the type from the dataset since it's in the itemData.type prop.
            delete newItemData[0].data["type"];
        }
        let newItem = await this.actor.createEmbeddedDocuments("Item", newItemData, {});

        newItem[0].sheet.render(true);

        return newItem;

    }

    isDropAllowed(type) {
        switch (type) {
            case "baseEffect":
            case "magicalEffect":
            case "spell":
                return true;
            default:
                return false;
        }
    }


}