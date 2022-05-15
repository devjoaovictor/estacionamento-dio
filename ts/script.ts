interface Veiculo {
    nome: string;
    placa: string;
    entrada: Date | string;
}

(function () {
    const $ = (query: string): HTMLInputElement | null =>
        document.querySelector(query);

    function calcTempo(mil: number) {
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000) / 1000);

        return `${min}m e ${sec}s`;
    }

    function garage() {
        function ler() {
            return localStorage.garage ? JSON.parse(localStorage.garage) : [];
        }

        function salvar(veiculos: Veiculo[]) {
            localStorage.setItem('garage', JSON.stringify(veiculos));
        }

        function adicionar(veiculo: Veiculo, salva?: boolean) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${veiculo.nome}</td>
                <td>${veiculo.placa}</td>
                <td>${veiculo.entrada}</td>
                <td>
                    <button class='delete' data-placa='${veiculo.placa}'>X</button>
                </td>
                `;

            row.querySelector('.delete')?.addEventListener('click', function () {
                remover(this.dataset.placa);
            })
            $('#garage')?.appendChild(row);
            
            if (salva) salvar([...ler(), veiculo]);
            }

        function remover(placa: string) {
            const { entrada, nome} = ler().find(
                (veiculo) => veiculo.placa === placa
                );

            const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());

            if(
                !confirm(`O Veiculo ${nome} permaneceu por ${tempo}. Deseja encerrar ?`)
            )

                return;

                salvar(ler().filter(veiculo => veiculo.placa !== placa));
                render();
        }

        function render() {
            $('#garage')!.innerHTML = '';
            const garage = ler();

            if (garage.length) {
                garage.forEach((veiculo) => adicionar(veiculo));
            }
        }
        
            return { ler, adicionar, remover, salvar, render };
        }

        garage().render()
        $('#cadastrar')?.addEventListener('click', () => {
            const nome = $('#nome')?.value;
            const placa = $('#placa')?.value;

            if (!nome || !placa) {
                alert('Os campos nome e placa são obrigatórios');
                return;
            }

            garage().adicionar({ nome, placa, entrada: new Date().toISOString() }, true);
        });
})();