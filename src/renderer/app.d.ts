import './assets/vscode-codicons/codicon.global.css';
import './assets/app.global.scss';
declare module 'vue/types/vue' {
    interface Vue {
        $globalClick: (func: () => void) => void;
    }
}
//# sourceMappingURL=app.d.ts.map