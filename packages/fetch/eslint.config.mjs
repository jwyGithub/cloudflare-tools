import eslint from '@jiangweiye/eslint-config';

export default eslint(
    {
        typescript: true
    },
    {
        ignores: ['dist/**/*', 'README.md', 'LICENSE']
    }
);
