import Vue from "vue";
declare class TitleBar extends Vue {
    title: string;
    maximized: boolean;
    created(): void;
    _set_maximized_flag(event: Electron.IpcRendererEvent, flag: string): void;
    _minimize_window(): void;
    _maximize_window(): void;
    _unmaximize_window(): void;
    _close_window(): void;
}
export default TitleBar;
//# sourceMappingURL=title-bar.vue.d.ts.map