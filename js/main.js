/* ==========================================================================
   DRAGON RUSH: MAIN ENTRY POINT
   ========================================================================== */

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    
    if (!canvas) {
        console.error('Canvas #gameCanvas não encontrado!');
        return;
    }

    // Criar instância do Motor de Jogo
    const gameEngine = new GameEngine(canvas);

    // Criar Controlador do Menu
    const menuController = new MenuController(gameEngine);

    // Loop Principal de Atualização e Renderização (60 FPS)
    function gameLoop() {
        gameEngine.update();
        gameEngine.render();
        requestAnimationFrame(gameLoop);
    }

    // Iniciar loop
    requestAnimationFrame(gameLoop);

    console.log('🔥 Dragon Rush: Dungeon Escape carregado com sucesso!');
});
