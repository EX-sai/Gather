import React from 'react';
import { motion } from 'framer-motion';
import {
	EventNote as EventNoteIcon,
	Person as PersonIcon,
	ConfirmationNumber as TicketIcon,
	AttachMoney as MoneyIcon
} from "@mui/icons-material";
import { Card, CardContent } from "../ui/card";
import { cn } from "../../lib/utils.js";

// Gradient backgrounds for cards
const CARD_BACKGROUNDS = [
	"bg-gradient-to-br from-blue-50 to-blue-100",
	"bg-gradient-to-br from-green-50 to-green-100",
	"bg-gradient-to-br from-orange-50 to-orange-100",
	"bg-gradient-to-br from-red-50 to-red-100"
];

const SummaryCards = ({ totalEvents, totalRegistrations, totalRevenue }) => {
	const cards = [
		{
			title: "Total Events",
			value: totalEvents ?? "0",
			icon: <EventNoteIcon className="text-blue-600 w-8 h-8" />,
			backgroundClass: CARD_BACKGROUNDS[0],
			iconBgClass: "bg-blue-100/50"
		},
		{
			title: "Total Attendees",
			value: totalRegistrations ?? "0",
			icon: <PersonIcon className="text-green-600 w-8 h-8" />,
			backgroundClass: CARD_BACKGROUNDS[1],
			iconBgClass: "bg-green-100/50"
		},
		{
			title: "Tickets Sold",
			value: totalRegistrations ?? "0",
			icon: <TicketIcon className="text-orange-600 w-8 h-8" />,
			backgroundClass: CARD_BACKGROUNDS[2],
			iconBgClass: "bg-orange-100/50"
		},
		{
			title: "Revenue",
			value: `$${totalRevenue ?? "0"}`,
			icon: <MoneyIcon className="text-red-600 w-8 h-8" />,
			backgroundClass: CARD_BACKGROUNDS[3],
			iconBgClass: "bg-red-100/50"
		}
	];

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
			{cards.map((card, index) => (
				<motion.div
					key={card.title}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						delay: index * 0.2,
						duration: 0.5
					}}
					className="w-full"
				>
					<Card
						className={cn(
							"w-full h-full overflow-hidden transition-all duration-300 ease-in-out",
							"hover:shadow-xl hover:scale-[1.02]",
							card.backgroundClass,
							"border-none"
						)}
					>
						<CardContent className="p-6 relative">
							<div className="flex justify-between items-center">
								<div className="space-y-2">
									<p className="text-sm font-medium text-gray-600 tracking-wide uppercase">
										{card.title}
									</p>
									<div className="text-3xl font-bold text-gray-800 tracking-tight">
										{card.value}
									</div>
								</div>
								<div
									className={cn(
										"p-3 rounded-full flex items-center justify-center",
										"transform transition-all duration-300 ease-in-out",
										"group-hover:rotate-12",
										card.iconBgClass
									)}
								>
									{card.icon}
								</div>
							</div>
							<div
								className="absolute -bottom-4 -right-4 w-24 h-24 opacity-10 rounded-full"
								style={{
									background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)'
								}}
							/>
						</CardContent>
					</Card>
				</motion.div>
			))}
		</div>
	);
};

export default SummaryCards;