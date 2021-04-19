import Vue from "vue";
declare class TitleBar extends Vue {
    title: string;
    maximized: boolean;
    focus: boolean;
    created(): void;
    _minimize_window(): void;
    _maximize_window(): void;
    _unmaximize_window(): void;
    _close_window(): void;
}
export default TitleBar;
//# sourceMappingURL=title-bar.vue.d.ts.map