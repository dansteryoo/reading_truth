# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)


# @devo = "Revelation"
# Devo.where(book: @devo).destroy_all


    # // {
    # //     "book_title": "Psalm",
    # //     "devo_passages": "Leviticus 4:1, Leviticus 1:1, Leviticus 1:1",
    # //     "devo_title": "Chapters 150",
    # //     "devo_summary": "",
    # //     "img_url": ""
    # // },

# Devo.destroy_all
# Devo.where(gender: "SHE").destroy_all
# Devo.where(gender: "SHE", book: "Nahum, Habakkuk, Zephaniah, and Haggai").destroy_all
Devo.where(book: "Leviticus").destroy_all
Devo.where(book: "Romans").destroy_all
# Devo.where(book: "Isaiah").destroy_all
# Devo.where(book: "Ezra").destroy_all
# Devo.where(book: "1 & 2 Chronicles").destroy_all
# Devo.where(book: "Deuteronomy").destroy_all
# Devo.where(book: "Numbers").destroy_all
# Devo.where(book: "Exodus").destroy_all
# Devo.where("book like ?", "%Hymns%").destroy_all

he_update = JSON.parse(File.read("#{Rails.root}/dist/update/he_update.json"))
she_update = JSON.parse(File.read("#{Rails.root}/dist/update/she_update.json"))

# he_data_1 = JSON.parse(File.read("#{Rails.root}/dist/he_v1.json"))
# he_data_2 = JSON.parse(File.read("#{Rails.root}/dist/he_v2.json"))
# he_data_3 = JSON.parse(File.read("#{Rails.root}/dist/he_v3.json"))
# he_data_4 = JSON.parse(File.read("#{Rails.root}/dist/he_v4.json"))
# he_data_5 = JSON.parse(File.read("#{Rails.root}/dist/he_v5.json"))
# she_data_1 = JSON.parse(File.read("#{Rails.root}/dist/she_v1.json"))
# she_data_2 = JSON.parse(File.read("#{Rails.root}/dist/she_v2.json"))
# she_data_3 = JSON.parse(File.read("#{Rails.root}/dist/she_v3.json"))
# she_data_4 = JSON.parse(File.read("#{Rails.root}/dist/she_v4.json"))
# she_data_5 = JSON.parse(File.read("#{Rails.root}/dist/she_v5.json"))

# hash = {
#     "HE": [he_update, he_data_1, he_data_2, he_data_3, he_data_4.reverse(), he_data_5],
#     "SHE": [she_update, she_data_1, she_data_2, she_data_3, she_data_4, she_data_5],
# }

hash = {
    "HE": [he_update],
    "SHE": [she_update]
}

hash.each do |gender, data_array|
    data_array.each do |each_data|
        each_data.each do |each|
            title = each["devo_title"].strip

            # if title == @devo
                book = each["book_title"].strip
                title = each["devo_title"].strip
                passages = each["devo_passages"].strip.blank? ? "blank" : each["devo_passages"].strip

                if (each["devo_summary"].strip.blank?) 
                    summary = "Pokem ipsum dolor sit amet Squirtle Manectric Seel Litwick Walrein Groudon. Charmander Cubone Loudred Azurill Snorlax Grumpig Hoothoot. Glitch City Diglett Snubbull Pidove Meganium Porygon2 Rainbow Badge. Misty Mudkip Fearow Zangoose Cryogonal to catch them is my real test Watchog. Thundershock Krabby Technical Machine Marowak Snorlax Gyarados Croagunk.\n\n Leech Life Petilil Psychic Bibarel Chingling bicycle Reuniclus. Ut enim ad minim veniam Ducklett Kanto Bagon Kirlia Exeggutor Seadra. Celadon City Koffing Celadon City Scrafty Hoothoot excepteur sint occaecat cupidatat non proident Vanillish. Dig Ledian Munna to denounce the evils of truth and love Snover Satoshi Tajiri the power that's inside. Bubble Farfetch'd Barboach Porygon2 Tyrogue what kind of Pokemon are you our courage will pull us through.\n\n Ash Qwilfish Shedinja Spoink Vileplume Starmie Chingling. Pokemon 4Ever Patrat Amoonguss Machop Tyranitar Hydreigon Fuchsia City. Growl Grovyle Charmeleon Elgyem Pokemon Pewter City Brock. Slash Sonic Boom Walrein Kabutops Regigigas Umbreon I like shorts. Grass Gloom Machoke Dragonair Doduo Kecleon Ponyta.\n\n Scratch Shieldon Venonat Poison Sting Metapod Larvitar Vanilluxe. Teleport to catch them is my real test Ninetales Team Rocket Clamperl Combee Bisharp. Flamethrower Lavender Town Feebas make it double Eevee Caterpie Sealeo. Zephyr Badge Great Ball Duosion Magby Munna Magnemite Corphish. Hydro Pump Torchic Simisear Skiploom Kanto Rufflet Blastoise.\n\n Dragon Rage Infernape Accelgor Torchic Hypno Honchkrow Combusken. Viridian City Dusknoir Klinklang Monferno Dragonair Ash's mother Dratini. Dragon Rage Flaaffy Mew deserunt mollit Charmeleon Pokemon 4Ever Butterfree. Fire Red Seismitoad Bonsly Tentacruel Wobbuffet Froslass Wailord. Pokemon 4Ever Hoothoot Turtwig Ice Sandslash Simipour Cubchoo."
                else 
                    summary = each["devo_summary"].strip
                end

                if (each["img_url"].strip.blank?)
                    if (gender.to_s === "SHE")
                        img = "https://res.cloudinary.com/dmwoxjusp/image/upload/v1630169994/shereads-logo_s9lsvp.jpg"
                    elsif (gender.to_s === "HE")
                        img = "https://res.cloudinary.com/dmwoxjusp/image/upload/v1630169994/hereads-logo_r2fecj.jpg"
                    end
                else
                    img = each["img_url"].strip
                end

                Devo.create!(
                    gender: gender.to_s,
                    book: book,
                    title: title,
                    passages: passages,
                    summary: summary,
                    img: img)
            # end
        end
    end
end

Devo.where(title: "Weekly Truth").destroy_all
Devo.where(title: "Grace Day").destroy_all