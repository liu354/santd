/**
 * @file select/Selector
 * @author
 */

import san, {DataTypes} from 'san';
import {classCreator} from '../core/util';
import Input from './Input';
import SingleSelector from './SingleSelector';
import MultipleSelector from './MultipleSelector';
const prefixCls = classCreator('select')();

export default san.defineComponent({
    dataTypes: {
        placeholder: DataTypes.string,
        inputValue: DataTypes.string,
        searchValue: DataTypes.string,
        selectedValue: DataTypes.oneOfType([DataTypes.string, DataTypes.array]),
        showSearch: DataTypes.bool,
        multiple: DataTypes.bool,
        treeCheckable: DataTypes.bool,
        popupVisible: DataTypes.bool,
        maxTagCount: DataTypes.number,
        maxTagPlaceholder: DataTypes.any,
        treeNodeLabelProp: DataTypes.string
    },

    template: `
        <div class="${prefixCls}-selection__rendered">
            <div
                class="${prefixCls}-selection__placeholder ${prefixCls}-unselectable"
                unselectable="on"
                on-click="handleClick"
            >
                {{placeholderText}}
            </div>
            <s-multiple-selector
                s-if="multiple || treeCheckable"
                s-ref="multipleSelector"
                value="{{selectedValue}}"
                treeNodeLabelProp="{{treeNodeLabelProp}}"
                maxTagCount="{{maxTagCount}}"
                maxTagPlaceholder="{{maxTagPlaceholder}}"
                on-removeValue="handleRemoveValue"
            />
            <s-single-selector
                s-else
                s-ref="singleSelector"
                s-if="selectedValue.length"
                value="{{selectedValue}}"
                treeNodeLabelProp="{{treeNodeLabelProp}}"
                inputValue="{{handledInputValue}}"
                showSearch="{{showSearch}}"
                popupVisible="{{popupVisible}}"
            >
                <slot name="title_{{item.key}}" s-for="item in selectedValue" />
            </s-single-selector>
            <div
                s-if="showSearch"
                class="${prefixCls}-search ${prefixCls}-search--inline"
            >
                <s-input
                    inputValue="{{inputValue}}"
                    searchValue="{{searchValue}}"
                    multiple="{{multiple}}"
                    popupVisible="{{popupVisible}}"
                />
            </div>
        </div>
    `,

    components: {
        's-input': Input,
        's-single-selector': SingleSelector,
        's-multiple-selector': MultipleSelector
    },

    initData() {
        return {
            placeholder: '',
            inputValue: '',
            searchValue: '',
            selectedValue: [],
            multiple: false,
            treeCheckable: false,
            popupVisible: false
        };
    },

    computed: {
        handledInputValue() {
            return this.data.get('searchValue') || this.data.get('inputValue');
        },
        placeholderText() {
            const inputValue = this.data.get('handledInputValue');
            const selectedValue = this.data.get('selectedValue');
            const placeholder = this.data.get('placeholder');
            if (!inputValue && !selectedValue.length && placeholder) {
                return placeholder;
            }
            return '';
        }
    },

    updated() {
        const {selectedValue, multiple} = this.data.get();
        if (multiple) {
            this.ref('multipleSelector') && this.ref('multipleSelector')._repaintChildren();
        }
        else if (selectedValue && selectedValue[0]) {
            const item = selectedValue[0];
            if (!item.title && item.node.sourceSlots.named.title) {
                this.sourceSlots.named[`title_${item.key}`] = item.node.sourceSlots.named.title;
                this.ref('singleSelector') && this.ref('singleSelector')._repaintChildren();
            }
        }
    },

    handleRemoveValue(index) {
        this.fire('removeValue', index);
    },

    handleClick() {
        this.fire('inputFocus');
    }
});
