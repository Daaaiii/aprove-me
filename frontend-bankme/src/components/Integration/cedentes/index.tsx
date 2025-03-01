"use client";
import axios from "axios";
import {useEffect, useState} from "react";
import Image from "next/image";

interface Assignor {
	id: string;
	document: string;
	name: string;
}

export default function Assignor() {
	const [assignor, setAssignors] = useState<Assignor[]>([]);
	const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);

	useEffect(() => {
		const fetchAssignors = async () => {
			try {
				const apiUrl =
					"https://bankme-api-5n7gl.ondigitalocean.app/integrations/assignor";

				const authToken = localStorage.getItem("token");

				const response = await axios.get(apiUrl, {
					headers: {
						Authorization: `Bearer ${authToken}`,
					},
				});
				if (response.data.length === 0) {
					setIsErrorModalOpen(true);
					setErrorMessage("Não há nenhum cedente cadastrado.");
				}

				setAssignors(response.data);
			} catch (error) {
				setIsErrorModalOpen(true);
				setErrorMessage(
					"Erro ao processar a solicitação. Tente novamente mais tarde."
				);
			}
		};

		fetchAssignors();
	}, [isDeleteSuccess]);

	const handleDelete = async (id: string) => {
		try {
			const apiUrl = `https://bankme-api-5n7gl.ondigitalocean.app/integrations/assignor/${id}`;

			const authToken = localStorage.getItem("token");

			const response = await axios.delete(apiUrl, {
				headers: {
					Authorization: `Bearer ${authToken}`,
				},
			});
			console.log(response.data);
			setIsDeleteSuccess(true);
			setTimeout(() => {
				setIsDeleteSuccess(false);
			}, 1000);
		} catch (error) {
			setIsErrorModalOpen(true);
			setErrorMessage(
				"Erro ao processar a solicitação. Tente novamente mais tarde."
			);
		}
	};

	return (
		<div className=" bg-white relative  flex flex-col h-screen w-full items-start justify-start p-4 m-4 rounded-md">
			<h1 className="w-full flex items-start justify-center text-blue-500 text-2xl font-bold p-4 mb-2">
				Cedentes
			</h1>

			{isDeleteSuccess && (
				<div className="success-message bg-green-200 text-green-800 p-2 mb-4 rounded-md">
					Cedente excluído com sucesso!
				</div>
			)}

			<nav className="w-full flex items-start justify-start bg-base-green p-4 rounded-xl">
				<ul className="w-full flex justify-evenly text-gray-700">
					<li className="w-1/4">ID do Cedente</li>
					<li>Documento</li>
					<li>Nome</li>
					<li>Editar</li>
					<li>Excluir</li>
				</ul>
			</nav>
			<div className="w-full flex  flex-col justify-start p-4 divide-y divide-gray-300 ">
				{assignor.map((assignor) => (
					<ul
						key={assignor.id}
						className="w-full flex justify-evenly text-gray-500 pb-4 pt-4"
					>
						<li>{assignor.id}</li>
						<li>{assignor.document}</li>
						<li>{assignor.name}</li>
						<li>
							<button>
								<Image
									src="/pencil-solid.svg"
									width={20}
									height={20}
									alt="pencil"
								></Image>
							</button>
						</li>
						<li>
							<button onClick={() => handleDelete(assignor.id)}>
								<Image
									src="/trash-can-solid.svg"
									width={20}
									height={20}
									alt="pencil"
								></Image>
							</button>
						</li>
					</ul>
				))}
			</div>
			{isErrorModalOpen && (
				<div className="error-modal fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-50">
					<div className="flex flex-col bg-white font-bold p-8 rounded-md items-end ">
						<p className="text-gray-600 mb-4 font-bold text-2xl">
							{errorMessage}
						</p>
						<button
							className="w-1/6 bg-gray-300 rounded-md px-3 py-2 mt-6"
							onClick={() => setIsErrorModalOpen(false)}
						>
							Fechar
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
