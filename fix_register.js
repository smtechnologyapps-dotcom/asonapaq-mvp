const fs = require('fs');

// 2. Modify MainAppContainer.tsx
let main = fs.readFileSync('components/MainAppContainer.tsx', 'utf8');
main = main.replace(
    /<MockLogin targetRole="paciente" onSuccess=\{\(\) => setIsAuthenticatedAs\('paciente'\)\} \/>/,
    "<MockLogin targetRole=\"paciente\" onSuccess={() => setIsAuthenticatedAs('paciente')} onRouteChange={handleRouteChange} />"
);
main = main.replace(
    /<MockLogin targetRole="voluntario" onSuccess=\{\(\) => setIsAuthenticatedAs\('voluntario'\)\} \/>/,
    "<MockLogin targetRole=\"voluntario\" onSuccess={() => setIsAuthenticatedAs('voluntario')} onRouteChange={handleRouteChange} />"
);
fs.writeFileSync('components/MainAppContainer.tsx', main, 'utf8');

// 1. Modify MockLogin.tsx
let mock = fs.readFileSync('components/security/MockLogin.tsx', 'utf8');
if (!mock.includes('onRouteChange?:')) {
    mock = mock.replace(
        "onSuccess: () => void;",
        "onSuccess: () => void;\n  onRouteChange?: (route: any) => void;"
    );
    mock = mock.replace(
        "export const MockLogin: React.FC<MockLoginProps> = ({ targetRole, onSuccess }) => {",
        "export const MockLogin: React.FC<MockLoginProps> = ({ targetRole, onSuccess, onRouteChange }) => {"
    );
    
    // Add the register button below the login form
    const registerButton = \
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg transition-all disabled:opacity-50"
          >
            <ShieldCheck className="w-5 h-5" /> 
            {isLoading ? 'Verificando...' : 'Ingresar de Forma Segura'}
          </button>
          
          {onRouteChange && targetRole !== 'admin' && (
            <div className="text-center mt-6 pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-500 mb-2">¿No tienes cuenta todavía?</p>
              <button 
                type="button" 
                onClick={() => onRouteChange('registro')}
                className="text-emerald-600 font-bold hover:underline transition-all"
              >
                Regístrate aquí
              </button>
            </div>
          )}
\;
    mock = mock.replace(
        /<button \\n\\s*type="submit"[\\s\\S]*?Ingresar de Forma Segura'}\\n\\s*<\\/button>/,
        registerButton
    );
    
    // Fallback if the regex fails
    if (!mock.includes('¿No tienes cuenta todavía?')) {
        const fallbackBtn = \
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg transition-all disabled:opacity-50"
          >
            <ShieldCheck className="w-5 h-5" /> 
            {isLoading ? 'Verificando...' : 'Ingresar de Forma Segura'}
          </button>\;
        mock = mock.replace(fallbackBtn, registerButton);
    }

    fs.writeFileSync('components/security/MockLogin.tsx', mock, 'utf8');
}
