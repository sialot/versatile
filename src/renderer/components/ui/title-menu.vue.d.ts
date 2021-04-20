import Vue from "vue";
interface MenuItem {
    text: string;
    shortcut: string;
    onClick: () => void;
}
interface MenuData {
    title: string;
    items: MenuItem[];
}
export default class TitleMenu extends Vue {
    currentActiveIndex: number;
    isMeClick: boolean;
    menutest: string;
    menuList: MenuData[];
    mounted(): void;
    _isClosed(): boolean;
    _overTitle(menuInex: number): void;
    _showTitle(menuInex: number): void;
    _onClick(menuIndex: number, itemIndex: number): void;
    closeAll(): void;
}
export {};
//# sourceMappingURL=title-menu.vue.d.ts.map